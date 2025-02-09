import { Injectable, Logger } from '@nestjs/common';
import { EventDispatcher, EventListener } from '@pe/nest-kit';
import { ElasticSearchClient, ElasticSearchExpressionDto } from '@pe/elastic-kit';
import {
  FoldersEventsEnum,
  FolderDocumentsResultsDto,
  ElasticAdditionalSearchResultsDto,
  FoldersElasticSearchService,
  ElasticFilterBodyInterface,
  EsDocumentHookWrapper,
  FolderDocument,
  FoldersService,
} from '@pe/folders-plugin';
import { ListQueryDto, TransactionFoldersIndexDto } from '../dto';
import {
  ElasticSearchService,
  TransactionHistoryService,
  TransactionsService,
} from '../services';
import { ConfigService } from '@nestjs/config';
import { FoldersConfig } from '../../config';
import { ExchangeCalculator, ExchangeCalculatorFactory } from '../currency';
import { BusinessService } from '@pe/business-kit';
import { TransactionModel } from '../models';
import { TransactionEventEnum } from '../enum/events';
import { TransactionTransformer } from '../transformers';
import { BusinessModel } from '../../business';
import { PaymentStatusesEnum } from '../enum';
import { TransactionBasicInterface } from '../interfaces';
import { ARCHIVE_FOLDER_ID } from '../folders.constants';

@Injectable()
export class FolderDocumentsListener {
  private readonly defaultCurrency: string;
  private readonly className: string = 'FolderDocumentsListener';

  constructor(
    private readonly businessService: BusinessService,
    private readonly configService: ConfigService,
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly transactionsService: TransactionsService,
    private readonly transactionHistoryService: TransactionHistoryService,
    private readonly exchangeCalculatorFactory: ExchangeCalculatorFactory,
    private readonly elasticSearchService: FoldersElasticSearchService,
    private readonly foldersService: FoldersService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly localElasticSearchService: ElasticSearchService,
    private readonly logger: Logger,
  ) {
    this.defaultCurrency = this.configService.get<string>('DEFAULT_CURRENCY');
  }

  @EventListener(TransactionEventEnum.TransactionUpdated)
  public async transactionUpdated(
    transaction: TransactionModel,
    retryOnError: boolean = false,
  ): Promise<void> {
    if (transaction.status === PaymentStatusesEnum.New) {
      return;
    }
    await this.eventDispatcher.dispatch(
      FoldersEventsEnum.FolderActionUpdateDocument,
      {
        ...transaction.toObject(),
        businessId: transaction.business_uuid,
      },
    );

    if (!retryOnError) {
      return;
    }

    const listDto: ListQueryDto = new ListQueryDto();
    listDto.filters.uuid = [{
      condition: 'is',
      value: [transaction.uuid],
    }];

    let esTransactions: TransactionBasicInterface[] = [];
    try {
      esTransactions = await this.localElasticSearchService.getSearchResults(listDto);
    } catch (error) {
      this.logger.error({
        error,
        message: 'Failed to fetch the transaction from elastic search',
        transactionUuid: transaction.uuid,
      });
    }

    if (
      esTransactions[0]?.uuid === transaction.uuid &&
      esTransactions[0]?.id === transaction.id &&
      (
        esTransactions[0]?.status !== transaction.status
        || esTransactions[0]?.customer_name !== transaction.customer_name
      )
    ) {
      this.logger.warn( {
        className:  this.className,
        message: `FoldersEventsEnum.FolderActionUpdateDocument failed! ID: ${transaction.id}, Retrying update`,
      });
      await this.sleep(1000);
      await this.eventDispatcher.dispatch(
        FoldersEventsEnum.FolderActionUpdateDocument,
        {
          ...transaction.toObject(),
          businessId: transaction.business_uuid,
        },
      );
    }
  }

  @EventListener(TransactionEventEnum.TransactionDeleted)
  public async transactionDeleted(
    transactionId: string,
  ): Promise<void> {

    await this.eventDispatcher.dispatch(
      FoldersEventsEnum.FolderActionDeleteDocument,
      transactionId,
    );
  }

  @EventListener(FoldersEventsEnum.GetRootDocumentsIds)
  public async getFilteredRootDocumentIds(
    folderDocuments: FolderDocumentsResultsDto,
  ): Promise<void> {
    const filter: any = {
      $and: [
        { business_uuid: folderDocuments.businessId },
        {
          uuid: {
            $nin: folderDocuments.excludedDocumentIds,
          },
        },
      ],
    };

    const filteredDocuments: string[] = await this.transactionsService.findAllUuidByFilter(filter);

    folderDocuments.results.push(...filteredDocuments);
  }

  @EventListener(FoldersEventsEnum.ElasticBeforeGetResults)
  public async elasticBeforeGetResults(
    listDto: ListQueryDto,
    filter: ElasticFilterBodyInterface,
    businessId: string,
  ): Promise<void> {
    if (!businessId) {
      filter.must_not.push({ term: { example: true } });
    }

    // do not return anonymized records if parentFolder is archive folder
    if (!filter.must.some(item => item?.match_phrase?.parentFolderId === ARCHIVE_FOLDER_ID)) {
      filter.must_not.push({ term: { anonymized: true } });
    }

    const business: BusinessModel = await this.businessService.findOneById(businessId) as unknown as BusinessModel;
    listDto.currency = business ? business.currency : this.defaultCurrency;
  }

  @EventListener(FoldersEventsEnum.ElasticBeforeIndexDocument)
  public async elasticBeforeIndexDocument(
    elasticSearchElementDto: EsDocumentHookWrapper<any>,
  ): Promise<void> {
    const transactionFoldersIndex: TransactionFoldersIndexDto =
      TransactionTransformer.transactionToFoldersIndex(elasticSearchElementDto.document);

    const transactionModel: TransactionModel =
      await this.transactionsService.findModelByUuid(elasticSearchElementDto.document.uuid);
    await this.transactionHistoryService.prepareTransactionHistory(transactionModel);

    transactionFoldersIndex.total_left =
      Math.round((transactionModel ? transactionModel.total_left : transactionFoldersIndex?.total_left) * 100);

    elasticSearchElementDto.document = transactionFoldersIndex;
  }

  @EventListener(FoldersEventsEnum.ElasticProcessSearchResult)
  public async elasticProcessSearchResult(
    elasticSearchElementDto: EsDocumentHookWrapper<any>,
  ): Promise<void> {
    elasticSearchElementDto.document.total_left = elasticSearchElementDto.document.total_left / 100;
  }

  @EventListener(FoldersEventsEnum.ElasticGetAdditionalSearchResults)
  public async elasticGetAdditionalSearchResults(
    additionalResults: ElasticAdditionalSearchResultsDto,
  ): Promise<void> {
    if (additionalResults.businessId) {
      const businessRootFolder: FolderDocument =
        await this.foldersService.getBusinessScopeRootFolder(additionalResults.businessId);

      const index: number = additionalResults.elasticFilters.must.findIndex((item: ElasticSearchExpressionDto) => {
        return item.match_phrase &&
          item.match_phrase.parentFolderId &&
          item.match_phrase.parentFolderId === businessRootFolder._id;
      });
      if (index !== -1) {
        additionalResults.elasticFilters.must.splice(index, 1);
      }
    }

    const amount: number = await this.totalAmount(additionalResults.elasticFilters, additionalResults.currency);

    additionalResults.paginationData = {
      amount,
      amount_currency: additionalResults.currency,
    };

    const status: any[] =
      await this.elasticSearchService.distinctFieldValues('status', additionalResults.elasticFilters);

    /* eslint @typescript-eslint/naming-convention: 0 */
    const specific_status: any[] =
      await this.elasticSearchService.distinctFieldValues('specific_status', additionalResults.elasticFilters);

    additionalResults.usage = {
      specific_statuses: specific_status ?
        specific_status.map((bucket: { key: string }) => bucket.key.toUpperCase()) : [],
      statuses: status ? status.map((bucket: { key: string }) => bucket.key.toUpperCase()) : [],
    };
  }

  private async totalAmount(
    elasticFilters: any = { },
    currency: string = null,
  ): Promise<number> {
    return currency
      ? this.calculateAmountMultiCurrency(elasticFilters, currency)
      : this.calculateAmountSingleCurrency(elasticFilters)
      ;
  }

  private async calculateAmountSingleCurrency(filters: any = { }): Promise<number> {
    const body: any = {
      aggs: {
        total_amount: {
          sum: {
            field: 'total_left',
          },
        },
      },
      from: 0,
      query: {
        bool: filters,
      },
    };

    return this.elasticSearchClient.search(FoldersConfig.elastic.index.elasticIndex, body)
      .then((results: any) => {
        return results?.body?.aggregations?.total_amount?.value ?
          results.body.aggregations.total_amount.value / 100 :
          0;
      });
  }

  private async calculateAmountMultiCurrency(
    filters: any = { },
    currency: string,
  ): Promise<number> {
    const body: any = {
      aggs: {
        total_amount: {
          aggs: {
            total_amount: {
              sum: {
                field: 'total_left',
              },
            },
          },
          terms: {
            field: 'currency',
          },
        },
      },
      from: 0,
      query: {
        bool: filters,
      },
    };

    const amounts: Array<{ key: string; total_amount: { value: number } }> =
      await this.elasticSearchClient
        .search(FoldersConfig.elastic.index.elasticIndex, body)
        .then((results: any) => {
          return results?.body?.aggregations?.total_amount?.buckets ?
            results.body.aggregations.total_amount.buckets :
            null;
        })
      ;
    let totalPerCurrency: number = 0;
    const calculator: ExchangeCalculator = this.exchangeCalculatorFactory.create();

    if (amounts) {
      for (const amount of amounts) {
        const currencyRate: number = await calculator.getCurrencyExchangeRate(amount.key);
        totalPerCurrency += currencyRate
          ? amount.total_amount.value / currencyRate
          : amount.total_amount.value
          ;
      }
    }
    const rate: number = await calculator.getCurrencyExchangeRate(currency);

    return rate
      ? Number(((totalPerCurrency * rate) / 100).toFixed(2))
      : Number((totalPerCurrency / 100).toFixed(2));
  }

  private async sleep(timeMs: number): Promise<void> {
    return new Promise((ok: any) =>
      setTimeout(
        () => {
          ok();
        },
        timeMs,
      ),
    );
  }
}
