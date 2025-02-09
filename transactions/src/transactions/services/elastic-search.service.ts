import { Injectable } from '@nestjs/common';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { TransactionDoubleConverter } from '../converter';
import { ExchangeCalculator, ExchangeCalculatorFactory } from '../currency';
import { ListQueryDto, PagingDto, PagingResultDto } from '../dto';
import { FiltersList } from '../elastic-filters/filters.list';
import { ElasticTransactionEnum } from '../enum';
import { TransactionBasicInterface } from '../interfaces/transaction';
import { DoubleValueProcessor } from '../tools';

@Injectable()
export class ElasticSearchService {

  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly exchangeCalculatorFactory: ExchangeCalculatorFactory,
  ) { }

  public async getResult(listDto: ListQueryDto): Promise<PagingResultDto> {
    const elasticFilters: any = this.createFiltersBody();
    if (listDto.filters) {
      this.addFilters(elasticFilters, listDto.filters);
    }
    if (listDto.search) {
      this.addSearchFilters(elasticFilters, listDto.search);
    }

    return Promise
      .all([
        this.search(elasticFilters, listDto.sorting, listDto.paging),
        this.totalAmount(elasticFilters, listDto.currency),
        this.distinctFieldValues('status', elasticFilters),
        this.distinctFieldValues('specific_status', elasticFilters),
        this.count(elasticFilters),
      ])
      .then((res: any) => {
        return {
          collection: res[0].collection,
          filters: { },
          pagination_data: {
            amount: res[1],
            amount_currency: listDto.currency,
            page: listDto.page,
            total: res[4].count,
          },
          usage: {
            specific_statuses: res[3] ? res[3].map((bucket: { key: string }) => bucket.key.toUpperCase()) : [],
            statuses: res[2] ? res[2].map((bucket: { key: string }) => bucket.key.toUpperCase()) : [],
          },
        };
      })
      ;
  }

  public async getSearchResults(listDto: ListQueryDto): Promise<TransactionBasicInterface[]> {
    const elasticFilters: any = this.createFiltersBody();
    if (listDto.filters) {
      this.addFilters(elasticFilters, listDto.filters);
    }
    if (listDto.search) {
      this.addSearchFilters(elasticFilters, listDto.search);
    }
    const result: { collection: TransactionBasicInterface[]; total: number } =
      await this.search(elasticFilters, listDto.sorting, listDto.paging);

    return result.collection;
  }

  private async search(
    filters: any,
    sorting: { [key: string]: string },
    paging: PagingDto,
  ): Promise<{ collection: TransactionBasicInterface[]; total: number }> {
    const body: any = {
      from: paging.limit * (paging.page - 1),
      query: {
        bool: filters,
      },
      size: paging.limit,
      sort: [
        sorting,
      ],
    };

    return this.elasticSearchClient.search(ElasticTransactionEnum.index, body)
      .then((results: any) => {
        return results?.body?.hits?.hits && results?.body?.hits?.total
          ? {
            collection: results.body.hits.hits.map(
              (elem: any) => {
                elem._source._id = elem._source.mongoId;
                delete elem._source.mongoId;

                elem._source = TransactionDoubleConverter.unpack(elem._source);

                return elem._source;
              },
            ),
            total: results.body.hits.total,
          } : {
            collection: [],
            total: 0,
          };
      });
  }

  private async count(
    filters: any,
  ): Promise<{ count: number }> {
    const body: any = {
      query: {
        bool: filters,
      },
    };

    return this.elasticSearchClient.count(ElasticTransactionEnum.index, body)
      .then((results: any) => {
        return {
          count: results?.body?.count ? results.body.count : 0,
        };
      });
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
            field: 'total',
          },
        },
      },
      from: 0,
      query: {
        bool: filters,
      },
    };

    return this.elasticSearchClient.search(ElasticTransactionEnum.index, body)
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
                field: 'total',
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
        .search(ElasticTransactionEnum.index, body)
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

  private async distinctFieldValues(
    field: string,
    filters: any = { },
  ): Promise<number> {
    const body: any = {
      aggs: {
        [field]: {
          terms: {
            field: field,
          },
        },
      },
      from: 0,
      query: {
        bool: filters,
      },
    };

    return this.elasticSearchClient.search(ElasticTransactionEnum.index, body)
      .then(
        (result: any) => result?.body?.aggregations[field]?.buckets ?
          result.body.aggregations[field].buckets : null
        ,
      );
  }

  private createFiltersBody(): { must: any[]; must_not: any[] } {
    return {
      must: [],
      must_not: [],
    };
  }

  private addSearchFilters(filters: any, search: string): void {
    const condition: { query_string: any } = {
      query_string: {
        fields: [
          'original_id^1',
          'customer_name^1',
          'merchant_name^1',
          'reference^1',
          'payment_details.finance_id^1',
          'payment_details.application_no^1',
          'customer_email^1',
        ],
        query: `*${search}*`,
      },
    };

    filters.must.push(condition);
  }

  private addFilters(elasticFilters: any, inputFilters: any): void {
    for (const key of Object.keys(inputFilters)) {
      this.addFilter(elasticFilters, key, inputFilters[key]);
    }
  }

  private addFilter(elasticFilters: any, field: string, filter: any): void {
    if (field === 'channel_set_uuid') {
      elasticFilters.must.push({
        match_phrase: {
          channel_set_uuid: filter.value[0],
        },
      });

      return;
    }
    if (filter && !filter.length) {
      filter = [filter];
    }

    for (let _filter of filter) {
      if (!_filter.value) {
        return;
      }
      if (!Array.isArray(_filter.value)) {
        _filter.value = [_filter.value];
      }

      _filter = DoubleValueProcessor.process(field, _filter);

      for (const elasticFilter of FiltersList) {
        if (_filter.condition === elasticFilter.getName()) {
          elasticFilter.apply(elasticFilters, field, _filter);
          break;
        }
      }
    }
  }
}
