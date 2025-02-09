import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Patch,
  Req,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createReadStream, readFileSync, ReadStream, Stats, statSync } from 'fs';
import * as path from 'path';

import {
  AccessTokenPayload,
  Acl,
  AclActionsEnum,
  QueryDto,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  User,
} from '@pe/nest-kit';
import { BusinessDto, BusinessService } from '@pe/business-kit';
import {
  ActionWrapperDto,
  ChannelsWithTransactionCountDto,
  DownloadResourceDto,
  ListQueryDto,
  PagingResultDto,
} from '../dto';
import { FastifyRequest, FastifyReply } from 'fastify';
import { TransactionOutputConverter, TransactionPaymentDetailsConverter } from '../converter';
import { ActionPayloadDto } from '../dto/action-payload';
import { PaymentActionsEnum } from '../enum';
import { TransactionOutputInterface, TransactionUnpackedDetailsInterface } from '../interfaces/transaction';
import { TransactionModel } from '../models';
import { TransactionSchemaName } from '../schemas';
import {
  ActionsRetriever,
  ContractService,
  ElasticSearchService,
  MongoSearchService,
  TransactionActionService,
  TransactionsExampleService,
  TransactionsService,
  TransactionsInfoService, TransactionHistoryService,
} from '../services';
import { TransactionsFilter } from '../tools';
import { BusinessModel } from '../../business';
import { ActionItemInterface } from '../../transactions/interfaces';
import { Readable } from 'stream';
import { TransactionHistoryQueryDto, TransactionHistoryResponseDto } from '../dto/history';
import { RequestDataHelper } from '../helpers';
import { TransactionRetentionSettingDto } from '../../business/dto';

const BusinessPlaceholder: string = ':businessId';
const UuidPlaceholder: string = ':uuid';

@Controller('business/:businessId')
@ApiTags('business')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class BusinessController {
  private readonly defaultCurrency: string;

  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly transactionHistoryService: TransactionHistoryService,
    private readonly mongoSearchService: MongoSearchService,
    private readonly elasticSearchService: ElasticSearchService,
    private readonly actionsRetriever: ActionsRetriever,
    private readonly transactionActionService: TransactionActionService,
    private readonly businessService: BusinessService<BusinessModel>,
    private readonly exampleService: TransactionsExampleService,
    private readonly configService: ConfigService,
    private readonly transactionsInfoService: TransactionsInfoService,

    private readonly logger: Logger,
    private readonly contractService: ContractService,
  ) {
    this.defaultCurrency = this.configService.get<string>('DEFAULT_CURRENCY');
  }

  @Get('detail/reference/:reference')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.oauth)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  @ApiParam({ name: 'businessId' })
  @ApiParam({ name: 'reference' })
  public async getDetailByReference(
    @Param('businessId') businessId: string,
    @Param('reference') reference: string,
  ): Promise<TransactionOutputInterface> {
    const transaction: TransactionModel = await this.transactionsService.findModelByParams({
      business_uuid: businessId,
      reference: reference,
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction by reference ${reference} not found`);
    }

    return this.transactionsInfoService.getFullDetails(transaction);
  }

  @Get('detail/original_id/:original_id')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.oauth)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  @ApiParam({ name: 'businessId' })
  @ApiParam({ name: 'original_id' })
  public async getByOriginalId(
    @ParamModel(
      {
        business_uuid: BusinessPlaceholder,
        original_id: ':original_id',
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
  ): Promise<TransactionOutputInterface> {
    return this.transactionsInfoService.getFullDetails(transaction);
  }

  @Get('detail/:uuid')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.oauth)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  @ApiParam({ name: 'businessId' })
  @ApiParam({ name: 'uuid' })
  public async getDetail(
    @ParamModel(
      {
        business_uuid: BusinessPlaceholder,
        uuid: UuidPlaceholder,
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
  ): Promise<TransactionOutputInterface> {
    return this.transactionsInfoService.getFullDetails(transaction);
  }

  @Get('transaction/:uuid/details')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.oauth)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  @ApiParam({ name: 'businessId' })
  @ApiParam({ name: 'uuid' })
  public async getTransactionDetails(
    @ParamModel(
      {
        business_uuid: BusinessPlaceholder,
        uuid: UuidPlaceholder,
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
  ): Promise<TransactionOutputInterface> {
    return this.transactionsInfoService.getDetails(transaction);
  }

  @Get('transaction/:uuid/actions')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.oauth)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  @ApiParam({ name: 'businessId' })
  @ApiParam({ name: 'uuid' })
  public async getTransactionActions(
    @ParamModel(
      {
        business_uuid: BusinessPlaceholder,
        uuid: UuidPlaceholder,
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
  ): Promise<ActionItemInterface[]> {
    return this.transactionsInfoService.getActionList(transaction);
  }

  @Get('transaction/:uuid/history')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.oauth)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async getTransactionHistories(
    @Query() query: TransactionHistoryQueryDto,
    @ParamModel(
      {
        business_uuid: BusinessPlaceholder,
        uuid: UuidPlaceholder,
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
  ): Promise<TransactionHistoryResponseDto[]> {
    return this.transactionHistoryService.getTransactionHistoryResponse(
      transaction,
      query,
    );
  }

  @Get('transaction/:uuid/history/:action')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.oauth)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async getTransactionHistoriesAction(
    @Param('action') action: string,
    @Query() query: TransactionHistoryQueryDto,
    @ParamModel(
      {
        business_uuid: BusinessPlaceholder,
        uuid: UuidPlaceholder,
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
  ): Promise<TransactionHistoryResponseDto[]> {
    return this.transactionHistoryService.getTransactionHistoryResponse(
      transaction,
      {
        ...query,
        action,
      });
  }

  @Get('history/:action')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.oauth)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async getRecentTransactionHistories(
    @Param('businessId') businessId: string,
    @Param('action') action: string,
    @QueryDto() query: TransactionHistoryQueryDto,
  ): Promise<TransactionHistoryResponseDto[]> {
    return this.transactionHistoryService.getRecentTransactionHistoryResponse(
      businessId,
      {
        ...query,
        action,
      });
  }

  @Post(':uuid/action/:action')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.oauth)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.update })
  @ApiParam({ name: 'businessId' })
  @ApiParam({ name: 'uuid' })
  public async runAction(
    @Param('action') action: string,
    @ParamModel(
      {
        business_uuid: BusinessPlaceholder,
        uuid: UuidPlaceholder,
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
    @User() user: AccessTokenPayload,
    @Req() req: FastifyRequest<any>,
    @Body() actionPayload: ActionPayloadDto,
  ): Promise<TransactionOutputInterface> {
    const actionWrapper: ActionWrapperDto = {
      action,
      forceRetryKey: RequestDataHelper.getForceRetryKey(req),
      idempotencyKey: RequestDataHelper.getIdempotencyKey(req),
      isExternalApiCall: false,
      payloadDto: actionPayload,
      user,
    };

    const updatedTransaction: TransactionUnpackedDetailsInterface = !transaction.example
      ? await this.transactionActionService.doAction(
        transaction,
        actionWrapper,
      )
      : await this.transactionActionService.doFakeAction(
        transaction,
        actionPayload,
        action,
      )
      ;

    return TransactionOutputConverter.convert(
      updatedTransaction,
      !transaction.example
        ? await this.actionsRetriever.retrieve(updatedTransaction)
        : this.actionsRetriever.retrieveFakeActions(updatedTransaction)
      ,
    );
  }

  @Get(':uuid/label/:pdf')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.anonymous)
  @ApiParam({ name: 'businessId' })
  @ApiParam({ name: 'uuid' })
  @ApiParam({ name: 'pdf' })
  public async label(
    @Param('pdf') pdf: string,
    @ParamModel(
      {
        business_uuid: BusinessPlaceholder,
        uuid: UuidPlaceholder,
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
    @Res() res: FastifyReply<any>,
  ): Promise<any> {
    const pdfPath: string = path.resolve(`./example_data/${pdf}`);
    const pdfStream: ReadStream = createReadStream(pdfPath);
    const stats: Stats = statSync(pdfPath);

    res.header('Content-Disposition', `inline; filename="${transaction.uuid}.pdf"`);
    res.header('Content-Length', stats.size);
    res.header('Content-Type', 'application/pdf');
    res.send(pdfStream);
  }

  @Get(':uuid/slip/:name')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.anonymous)
  public async slip(
    @Param('name') name: string,
    @ParamModel({ business_uuid: BusinessPlaceholder }, TransactionSchemaName) business: BusinessModel,
    @ParamModel(
      {
        business_uuid: BusinessPlaceholder,
        uuid: UuidPlaceholder,
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
  ): Promise<any> {
    const slipPath: string = path.resolve(`./example_data/${name}`);

    return JSON.parse(readFileSync(slipPath, 'utf8'));
  }

  @Post(':uuid/legacy-api-action/shipped')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.oauth)
  public async runLegacyApiShippedAction(
    @ParamModel(
      {
        business_uuid: BusinessPlaceholder,
        uuid: UuidPlaceholder,
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
    @Body() actionPayload: ActionPayloadDto,
    @Req() req: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
  ): Promise<TransactionUnpackedDetailsInterface> {
    const actionWrapper: ActionWrapperDto = {
      action: PaymentActionsEnum.ShippingGoods,
      forceRetryKey: RequestDataHelper.getForceRetryKey(req),
      idempotencyKey: RequestDataHelper.getIdempotencyKey(req),
      isExternalApiCall: true,
      payloadDto: actionPayload,
      user,
    };

    return this.transactionActionService.doAction(transaction, actionWrapper, true);
  }

  @Post(':uuid/legacy-api-action/:action')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.oauth)
  public async runLegacyApiAction(
    @Param('action') action: string,
    @ParamModel(
      {
        business_uuid: BusinessPlaceholder,
        uuid: UuidPlaceholder,
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
    @Body() actionPayload: ActionPayloadDto,
    @Req() req: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
  ): Promise<TransactionUnpackedDetailsInterface> {
    const actionWrapper: ActionWrapperDto = {
      action,
      forceRetryKey: RequestDataHelper.getForceRetryKey(req),
      idempotencyKey: RequestDataHelper.getIdempotencyKey(req),
      isExternalApiCall: true,
      payloadDto: actionPayload,
      user,
    };

    return this.transactionActionService.doAction(transaction, actionWrapper);
  }

  @Get(':uuid/update-status')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async updateStatus(
    @ParamModel(
      {
        business_uuid: BusinessPlaceholder,
        uuid: UuidPlaceholder,
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
  ): Promise<TransactionOutputInterface> {
    const updatedTransaction: TransactionUnpackedDetailsInterface =
      await this.transactionActionService.updateStatus(transaction);

    return TransactionOutputConverter.convert(
      updatedTransaction,
      await this.actionsRetriever.retrieve(updatedTransaction),
    );
  }

  @Get('channels/transaction-summary')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async getChannelsWithTransactionsCount(
    @Param('businessId') businessId: string,
  ): Promise<ChannelsWithTransactionCountDto[]> {
    return this.transactionsService.getChannelsWithTransactionsCount(businessId);
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async getList(
    @Param('businessId') businessId: string,
    @QueryDto() listDto: ListQueryDto,
  ): Promise<PagingResultDto> {
    listDto.filters = TransactionsFilter.applyBusinessFilter(businessId, listDto.filters);
    const business: BusinessModel = await this.businessService
      .findOneById(businessId) as unknown as BusinessModel;
    listDto.currency = business ? business.currency : this.defaultCurrency;

    return this.elasticSearchService.getResult(listDto);
  }

  @Get('download-contract/:original_id')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async downloadContract(
    @ParamModel(
      {
        business_uuid: BusinessPlaceholder,
        original_id: ':original_id',
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
    @User() user: AccessTokenPayload,
    @Res() response: FastifyReply<any>,
  ): Promise<void> {
    const unpackedTransaction: TransactionUnpackedDetailsInterface = TransactionPaymentDetailsConverter.convert(
      transaction.toObject({ virtuals: true }),
    );

    const result: DownloadResourceDto =
      await this.contractService.downloadContractWithHistory(unpackedTransaction, user);

    const buffer: Buffer = Buffer.from(result.base64Content, 'base64');

    const stream: Readable = new Readable();
    stream.push(buffer);
    stream.push(null);

    response.header('Content-Type', result.contentType);
    response.header('Content-Disposition', `attachment; filename=${result.filenameWithExtension}`);
    response.header('Content-Length', buffer.length);

    response.send(stream);
  }

  @Get('mongo')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async getMongo(
    @Param('businessId') businessId: string,
    @QueryDto() listDto: ListQueryDto,
  ): Promise<PagingResultDto> {
    listDto.filters = TransactionsFilter.applyBusinessFilter(businessId, listDto.filters);
    const business: BusinessModel = await this.businessService
      .findOneById(businessId) as unknown as BusinessModel;

    listDto.currency = business ? business.currency : this.defaultCurrency;

    return this.mongoSearchService.getResult(listDto);
  }

  @Get('transaction-retention-setting')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  async getTransactionRetentionSetting(
    @Param('businessId') businessId: string,
  ): Promise<TransactionRetentionSettingDto> {
    const business: BusinessModel = await this.businessService
      .findOneById(businessId);

    if (!business) {
      throw new NotFoundException(`businessId by id ${businessId} not found`);
    }

    return {
      failedTransactionsRetentionPeriod: business.failedTransactionsRetentionPeriod,
      transactionsRetentionPeriod: business.transactionsRetentionPeriod,
    };
  }

  @Patch('transaction-retention-setting')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.update })
  async patchTransactionRetentionSetting(
    @Param('businessId') businessId: string,
    @Body() businessDto: TransactionRetentionSettingDto,
  ): Promise<TransactionRetentionSettingDto> {
    const business: BusinessModel = await this.businessService
      .updateById(businessId, businessDto);
    
    return {
      failedTransactionsRetentionPeriod: business.failedTransactionsRetentionPeriod,
      transactionsRetentionPeriod: business.transactionsRetentionPeriod,
    };
  }


  @Get('settings')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async getSettings(): Promise<any> {
    return {
      columns_to_show: [
        'created_at',
        'customer_email',
        'customer_name',
        'merchant_email',
        'merchant_name',
        'specific_status',
        'status',
        'type',
      ],
      direction: '',
      filters: null,
      id: null,
      limit: '',
      order_by: '',
    };
  }

  @Post('trigger-example')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.anonymous)
  public async triggerExample(
    @Body() businessDto: BusinessDto,
  ): Promise<any> {
    return this.exampleService.createBusinessExamples(businessDto, []);
  }

}
