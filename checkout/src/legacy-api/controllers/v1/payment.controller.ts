import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AccessTokenPayload, Business, JwtAuthGuard, ParamModel, QueryDto, Roles, RolesEnum, User } from '@pe/nest-kit';
import { plainToClass } from 'class-transformer';
import { FastifyRequest } from 'fastify';
import { ApiCallService, OauthService } from '../../../common/services';
import { ConnectionSchemaName, PaymentSchemaName } from '../../../mongoose-schema';
import {
  ApiCallResultDto,
  HeadersHolderDto,
  PaymentCodeResponseDto,
  TermsFilterRequestDto,
  TransactionHistoryDto,
  TransactionHistoryQueryDto,
} from '../../dto';
import { UrlActionsToPaymentActions, VerifyTypeEnum } from '../../enum';
import { RawRequestInterface } from '../../interfaces';
import { PaymentCodeModel, PaymentModel } from '../../models';
import {
  LegacyApiProcessor,
  LegacyApiResponseTransformerService,
  PaymentService,
  PaymentCodeService,
  PaymentActionService,
  ExternalApiExecutor,
  TermsService,
} from '../../services';
import { ConnectionModel } from '../../../connection/models';
import { PaymentDataHelper } from '../../helpers';
import { ApiCallModel } from '../../../common/models';
import { CreatePaymentWrapperDto, PaymentListFilterDto, TransactionActionHistoryQueryDto } from '../../dto/request/v1';

@Controller('payment')
@ApiTags('legacy-api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(
    private readonly oauthService: OauthService,
    private readonly externalApiExecutor: ExternalApiExecutor,
    private readonly apiCallService: ApiCallService,
    private readonly paymentService: PaymentService,
    private readonly responseTransformer: LegacyApiResponseTransformerService,
    private readonly legacyApiProcessor: LegacyApiProcessor,
    private readonly paymentCodeService: PaymentCodeService,
    private readonly paymentActionService: PaymentActionService,
    private readonly termService: TermsService,
    private readonly logger: Logger,
  ) { }

  @Get(':id')
  @Roles(RolesEnum.oauth)
  @ApiParam({ name: 'id' })
  public async retrievePayment(
    @Req() req: FastifyRequest<any>,
    @ParamModel(
      {
        original_id: ':id',
      },
      PaymentSchemaName,
    ) payment: PaymentModel,
    @User() user: AccessTokenPayload,
    @QueryDto() queryDto: TransactionHistoryQueryDto,
  ): Promise<ApiCallResultDto> {
    try {
      this.oauthService.getOauthUserBusiness(user, payment.business_uuid);
    } catch (e) {
      throw new ForbiddenException(`You're not allowed to get payment with id ${payment.original_id}`);
    }

    let history: TransactionHistoryDto[] = [];
    try {
      history = await this.paymentActionService.getTransactionHistories(user, payment.original_id, req, queryDto);
    } catch (e) {
    }

    return this.responseTransformer.successPaymentResponse(payment, history);
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RolesEnum.oauth)
  public async createPayment(
    @Req() request: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
    @Body() dto?: any,
  ): Promise<ApiCallResultDto> {
    if (!dto || !Object.keys(dto).length) {
      dto = (request.raw as RawRequestInterface).body;
    }

    let paymentDto: CreatePaymentWrapperDto = plainToClass(CreatePaymentWrapperDto, dto);
    if (!paymentDto) {
      paymentDto = new CreatePaymentWrapperDto();
    }

    return this.legacyApiProcessor.processV1CreatePayment({ request, targetBusinessId, user }, paymentDto);
  }

  @Post('/submit')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RolesEnum.oauth)
  public async submitPayment(
    @Req() request: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
    @Body() dto?: any,
  ): Promise<ApiCallResultDto> {
    if (!dto || !Object.keys(dto).length) {
      dto = (request.raw as RawRequestInterface).body;
    }

    let paymentDto: CreatePaymentWrapperDto = plainToClass(CreatePaymentWrapperDto, dto);
    if (!paymentDto) {
      paymentDto = new CreatePaymentWrapperDto();
    }

    return this.legacyApiProcessor.processV1SubmitPayment({ request, targetBusinessId, user }, paymentDto);
  }

  @Post('/risk')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RolesEnum.oauth)
  public async getRiskSessionId(
    @Req() req: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
  ): Promise<ApiCallResultDto> {
    try {
      const businessId: string = this.oauthService.getOauthUserBusiness(user, targetBusinessId);
      const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(req);

      return this.externalApiExecutor.externalRiskSessionId(headersHolder, businessId);
    } catch (e) {
      return this.responseTransformer.failedCustomErrorResponse(e.message, 'risk');
    }
  }

  @Get(':variantId/rates')
  @Roles(RolesEnum.oauth)
  @ApiParam({ name: 'variantId' })
  public async getRates(
    @ParamModel(
      {
        _id: ':variantId',
      },
      ConnectionSchemaName,
    ) connection: ConnectionModel,
    @Query() queryDto: any,
    @Req() req: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
  ): Promise<ApiCallResultDto> {
    try {
      const businessId: string = this.oauthService.getOauthUserBusiness(user, targetBusinessId);
      const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(req);

      if (connection.businessId !== businessId) {
        throw new ForbiddenException(`You are not allowed to get rates for variant ${connection.id}`);
      }

      return this.externalApiExecutor.externalRates(headersHolder, connection, queryDto);
    } catch (e) {
      return this.responseTransformer.failedCustomErrorResponse(e.message, 'rates');
    }
  }

  @Post('/terms/:paymentMethod')
  @Roles(RolesEnum.oauth)
  @ApiParam({ name: 'paymentMethod' })
  public async getTerms(
    @Param('paymentMethod') paymentMethod: string,
    @Body() filterDto: TermsFilterRequestDto,
    @Req() req: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
  ): Promise<ApiCallResultDto> {

    const businessId: string = this.oauthService.getOauthUserBusiness(user, targetBusinessId);
    const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(req);

    return this.termService.getTermsForPaymentMethodAndFilter(paymentMethod, filterDto, headersHolder, businessId);
  }

  @Get('')
  @Roles(RolesEnum.oauth)
  public async getPaymentsList(
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
    @Query('payment_method') paymentMethod?: string,
    @Query('date') date?: string,
    @Query('currency') currency?: string,
    @Query('state') status?: string,
    @Query('limit') limit?: string,
  ): Promise<ApiCallResultDto> {
    let businessId: string;

    try {
      businessId = this.oauthService.getOauthUserBusiness(user, targetBusinessId);
    } catch (e) {
      throw new ForbiddenException(`You're not allowed to get payment list`);
    }

    const paymentListFilterDTO: PaymentListFilterDto = new PaymentListFilterDto(
      paymentMethod,
      date,
      currency,
      status,
      limit,
    );

    try {
      const paymentList: PaymentModel[] =
        await this.paymentService.findByBusinessAndFilter(businessId, paymentListFilterDTO);

      return this.responseTransformer.successPaymentListResponse(paymentListFilterDTO, paymentList);
    } catch (e) {
      return this.responseTransformer.failedPaymentListResponse(paymentListFilterDTO, businessId, e.message);
    }
  }

  @Post('/:action/:id')
  @Roles(RolesEnum.oauth)
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'action' })
  public async paymentAction(
    @Req() req: FastifyRequest<any>,
    @Param('action') action: string,
    @ParamModel(
      {
        original_id: ':id',
      },
      PaymentSchemaName,
    ) payment: PaymentModel,
    @User() user: AccessTokenPayload,
    @Body() dto?: object,
  ): Promise<ApiCallResultDto> {
    let businessId: string;

    try {
      businessId = this.oauthService.getOauthUserBusiness(user, payment.business_uuid);
    } catch (e) {
      this.logger.warn({
        action: action,
        businessToFind: payment.business_uuid,
        clientId: user.clientId,
        error: e.message,
        message: `Failed to get business id from token for action`,
        paymentId: payment.original_id,
        roles: user.roles,
        tokenId: user.tokenId,
      });

      throw new ForbiddenException(`You're not allowed to get payment with id ${payment.original_id}`);
    }

    if (!UrlActionsToPaymentActions.has(action.toLowerCase())) {
      throw new NotFoundException(`Action ${action} is not supported`);
    }

    if (!dto || !Object.keys(dto).length) {
      dto = (req.raw as RawRequestInterface).body;
    }

    return this.paymentActionService.doAction(payment, action, dto, businessId, req);
  }

  @Get('/shipping-goods')
  @Roles(RolesEnum.oauth)
  @ApiQuery({ name: 'limit' })
  @ApiQuery({ name: 'status' })
  public async getShippingPaymentActions(
    @Req() req: FastifyRequest<any>,
    @QueryDto() queryDto: TransactionHistoryQueryDto,
    @User() user: AccessTokenPayload,
  ): Promise<TransactionHistoryDto[]> {
    return this.paymentActionService.getRecentTransactionHistory(user, 'shipping-goods', req, queryDto);
  }

  @Get('/refund')
  @Roles(RolesEnum.oauth)
  @ApiQuery({ name: 'limit' })
  @ApiQuery({ name: 'status' })
  public async getRefundPaymentActions(
    @Req() req: FastifyRequest<any>,
    @QueryDto() queryDto: TransactionHistoryQueryDto,
    @User() user: AccessTokenPayload,
  ): Promise<TransactionHistoryDto[]> {
    return this.paymentActionService.getRecentTransactionHistory(user, 'refund', req, queryDto);
  }

  @Get('/cancel')
  @Roles(RolesEnum.oauth)
  @ApiQuery({ name: 'limit' })
  @ApiQuery({ name: 'status' })
  public async getCancelPaymentActions(
    @Req() req: FastifyRequest<any>,
    @QueryDto() queryDto: TransactionHistoryQueryDto,
    @User() user: AccessTokenPayload,
  ): Promise<TransactionHistoryDto[]> {
    return this.paymentActionService.getRecentTransactionHistory(user, 'cancel', req, queryDto);
  }

  @Get('/:action/:id')
  @Roles(RolesEnum.oauth)
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'action' })
  @ApiQuery({ name: 'limit' })
  public async getPaymentActions(
    @Req() req: FastifyRequest<any>,
    @Param('action') action: string,
    @QueryDto() queryDto: TransactionActionHistoryQueryDto,
    @ParamModel({ original_id: ':id' }, PaymentSchemaName) payment: PaymentModel,
    @User() user: AccessTokenPayload,
  ): Promise<TransactionHistoryDto[]> {
    let businessId: string;

    try {
      businessId = this.oauthService.getOauthUserBusiness(user, payment.business_uuid);
    } catch (e) {
      throw new ForbiddenException(`You're not allowed to get payment with id ${payment.original_id}`);
    }

    if (!UrlActionsToPaymentActions.has(action.toLowerCase())) {
      throw new NotFoundException(`Action ${action} is not supported`);
    }

    return this.paymentActionService.getTransactionHistory(payment, action, req, queryDto.limit);
  }

  @Get('/payment-code/:id')
  @Roles(RolesEnum.oauth, RolesEnum.merchant, RolesEnum.guest)
  @ApiParam({ name: 'id' })
  public async getPaymentCode(
    @ParamModel(
      {
        original_id: ':id',
      },
      PaymentSchemaName,
    ) payment: PaymentModel,
  ): Promise<PaymentCodeResponseDto> {
    const apiCall: ApiCallModel = await this.apiCallService.findApiCallById(payment.api_call_id);
    if (!apiCall || !apiCall.verify_type || apiCall.verify_type !== VerifyTypeEnum.code) {
      throw new NotFoundException('Payment code not found');
    }

    const paymentCode: PaymentCodeModel = await this.paymentCodeService.getPaymentCodeByApiCall(apiCall);

    return this.responseTransformer.preparePaymentCodeResponse(paymentCode);
  }
}
