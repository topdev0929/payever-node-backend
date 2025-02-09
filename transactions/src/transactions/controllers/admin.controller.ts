import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenPayload, ParamModel, QueryDto, User, Acl, AclActionsEnum } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { TransactionOutputConverter } from '../converter';
import { ActionWrapperDto, ListQueryDto, PagingResultDto } from '../dto';
import { ActionPayloadDto } from '../dto/action-payload';
import { TransactionOutputInterface, TransactionUnpackedDetailsInterface } from '../interfaces/transaction';
import { TransactionModel } from '../models';
import { TransactionSchemaName } from '../schemas';
import {
  ActionsRetriever,
  ElasticSearchService,
  MongoSearchService,
  TransactionActionService,
  TransactionsService,
  TransactionHistoryService,
  TransactionsInfoService,
} from '../services';
import { IsNotExampleFilter } from '../tools';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from 'fastify';
import { ActionItemInterface } from '../interfaces';
import { TransactionHistoryQueryDto, TransactionHistoryResponseDto } from '../dto/history';
import { RequestDataHelper } from '../helpers';

@Controller('admin')
@ApiTags('admin')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class AdminController {
  private readonly defaultCurrency: string;

  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly mongoSearchService: MongoSearchService,
    private readonly elasticSearchService: ElasticSearchService,
    private readonly actionsRetriever: ActionsRetriever,
    private readonly transactionActionService: TransactionActionService,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly transactionHistoryService: TransactionHistoryService,
    private readonly transactionsInfoService: TransactionsInfoService,
  ) {
    this.defaultCurrency = this.configService.get<string>('DEFAULT_CURRENCY');
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  public async getList(
    @QueryDto() listDto: ListQueryDto,
  ): Promise<PagingResultDto> {
    listDto.filters = IsNotExampleFilter.apply(listDto.filters);
    listDto.currency = this.defaultCurrency;

    return this.elasticSearchService.getResult(listDto);
  }

  @Get('mongo')
  @HttpCode(HttpStatus.OK)
  public async getMongo(
    @QueryDto() listDto: ListQueryDto,
  ): Promise<PagingResultDto> {
    listDto.filters = IsNotExampleFilter.apply(listDto.filters);
    listDto.currency = this.defaultCurrency;

    return this.mongoSearchService.getResult(listDto);
  }

  @Get('detail/reference/:reference')
  @HttpCode(HttpStatus.OK)
  public async getDetailByReference(
    @ParamModel(
      {
        reference: ':reference',
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
  ): Promise<TransactionOutputInterface>  {
    if (!transaction) {
      throw new NotFoundException(`Transaction by reference not found`);
    }

    return this.transactionsInfoService.getFullDetails(transaction);
  }

  @Get('detail/:uuid')
  @HttpCode(HttpStatus.OK)
  public async getDetail(
    @ParamModel(
      {
        uuid: ':uuid',
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
  ): Promise<TransactionOutputInterface> {
    return this.transactionsInfoService.getFullDetails(transaction);
  }

  @Get('transaction/:uuid/details')
  @HttpCode(HttpStatus.OK)
  public async getTransactionDetails(
    @ParamModel(
      {
        uuid: ':uuid',
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
  public async getTransactionActions(
    @ParamModel(
      {
        uuid: ':uuid',
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
  ): Promise<ActionItemInterface[]> {
    return this.transactionsInfoService.getActionList(transaction);
  }

  @Get('transaction/:uuid/history/:action')
  @HttpCode(HttpStatus.OK)
  public async getTransactionHistories(
    @Param('action') action: string,
    @Query() query: TransactionHistoryQueryDto,
    @ParamModel(
      {
        uuid: ':uuid',
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

  @Post(':uuid/action/:action')
  @HttpCode(HttpStatus.OK)
  public async runAction(
    @Param('action') action: string,
    @ParamModel(
      {
        uuid: ':uuid',
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
    @Body() actionPayload: ActionPayloadDto,
    @Req() req: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
  ): Promise<TransactionOutputInterface> {
    const actionWrapper: ActionWrapperDto = {
      action,
      forceRetryKey: RequestDataHelper.getForceRetryKey(req),
      idempotencyKey: RequestDataHelper.getIdempotencyKey(req),
      payloadDto: actionPayload,
      user,
    };

    const updatedTransaction: TransactionUnpackedDetailsInterface =
      await this.transactionActionService.doAction(transaction, actionWrapper);

    return TransactionOutputConverter.convert(
      updatedTransaction,
      await this.actionsRetriever.retrieve(updatedTransaction),
    );
  }

  @Get(':uuid/update-status')
  @HttpCode(HttpStatus.OK)
  public async updateStatus(
    @ParamModel(
      {
        uuid: ':uuid',
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

  @Get('settings')
  @HttpCode(HttpStatus.OK)
  public async getSettings(
  ): Promise<any> {
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

}
