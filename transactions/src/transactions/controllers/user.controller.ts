import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  JwtAuthGuard,
  Roles,
  RolesEnum,
  User,
  UserTokenInterface,
  ParamModel,
  QueryDto,
} from '@pe/nest-kit';
import { TransactionOutputConverter } from '../converter';
import { ListQueryDto, PagingResultDto } from '../dto';
import { ActionItemInterface } from '../interfaces';
import { TransactionOutputInterface, TransactionUnpackedDetailsInterface } from '../interfaces/transaction';
import { TransactionModel } from '../models';
import { TransactionSchemaName } from '../schemas';
import {
  ElasticSearchService,
  MongoSearchService,
  TransactionsService,
  TransactionHistoryService,
  TransactionsInfoService,
} from '../services';
import { TransactionsFilter } from '../tools';
import { ConfigService } from '@nestjs/config';
import { TransactionHistoryQueryDto, TransactionHistoryResponseDto } from '../dto/history';

@Controller('user')
@ApiTags('user')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.user)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class UserController {
  private readonly defaultCurrency: string;

  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly mongoSearchService: MongoSearchService,
    private readonly elasticSearchService: ElasticSearchService,
    private readonly configService: ConfigService,
    private readonly transactionHistoryService: TransactionHistoryService,
    private readonly transactionsInfoService: TransactionsInfoService,
  ) {
    this.defaultCurrency = this.configService.get<string>('DEFAULT_CURRENCY');
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  public async getList(
    @User() user: UserTokenInterface,
    @QueryDto() listDto: ListQueryDto,
  ): Promise<PagingResultDto> {
    listDto.filters = TransactionsFilter.applyUserUuidFilter(user?.id, listDto.filters);
    listDto.currency = this.defaultCurrency;

    return this.elasticSearchService.getResult(listDto);
  }

  @Get('mongo')
  @HttpCode(HttpStatus.OK)
  public async getMongo(
    @User() user: UserTokenInterface,
    @QueryDto() listDto: ListQueryDto,
  ): Promise<PagingResultDto> {
    listDto.filters = TransactionsFilter.applyUserUuidFilter(user?.id, listDto.filters);
    listDto.currency = this.defaultCurrency;

    return this.mongoSearchService.getResult(listDto);
  }

  @Get('detail/:uuid')
  @HttpCode(HttpStatus.OK)
  public async getDetail(
    @User() user: UserTokenInterface,
    @ParamModel(
      {
        uuid: ':uuid',
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
  ): Promise<TransactionOutputInterface> {
    const actions: ActionItemInterface[] = [];
    const found: TransactionUnpackedDetailsInterface =
      await this.transactionsService.findUnpackedByParams({ uuid: transaction.uuid, user_uuid: user.id });

    if (!found) {
      throw new NotFoundException(`Transaction not found.`);
    }

    return TransactionOutputConverter.convert(found, actions);
  }
  
  @Get('transaction/:uuid/details')
  @HttpCode(HttpStatus.OK)
  public async getTransactionDetails(
    @User() user: UserTokenInterface,
    @ParamModel(
      {
        uuid: ':uuid',
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
  ): Promise<TransactionOutputInterface> {
    const found: TransactionUnpackedDetailsInterface =
      await this.transactionsService.findUnpackedByParams({ uuid: transaction.uuid, user_uuid: user.id });
    
    if (!found) {
      throw new NotFoundException(`Transaction not found.`);
    }
    
    return this.transactionsInfoService.getDetails(transaction);
  }
  
  @Get('transaction/:uuid/actions')
  @HttpCode(HttpStatus.OK)
  public async getTransactionActions(
    @User() user: UserTokenInterface,
    @ParamModel(
      {
        uuid: ':uuid',
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
  ): Promise<ActionItemInterface[]> {
    const found: TransactionUnpackedDetailsInterface =
      await this.transactionsService.findUnpackedByParams({ uuid: transaction.uuid, user_uuid: user.id });
    
    if (!found) {
      throw new NotFoundException(`Transaction not found.`);
    }
    
    return this.transactionsInfoService.getActionList(transaction);
  }
  
  @Get('transaction/:uuid/history/:action')
  @HttpCode(HttpStatus.OK)
  public async getTransactionHistories(
    @User() user: UserTokenInterface,
    @Param('action') action: string,
    @Query() query: TransactionHistoryQueryDto,
    @ParamModel(
      {
        uuid: ':uuid',
      },
      TransactionSchemaName,
    ) transaction: TransactionModel,
  ): Promise<TransactionHistoryResponseDto[]> {
    const found: TransactionUnpackedDetailsInterface =
      await this.transactionsService.findUnpackedByParams({ uuid: transaction.uuid, user_uuid: user.id });
    
    if (!found) {
      throw new NotFoundException(`Transaction not found.`);
    }
    
    return this.transactionHistoryService.getTransactionHistoryResponse(
      transaction,
      {
        ...query,
        action,
      });
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
      id: null, // 9???
      limit: '',
      order_by: '',
    };
  }
}
