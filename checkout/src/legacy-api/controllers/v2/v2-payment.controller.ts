import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  UseGuards,
  ForbiddenException,
  NotFoundException,
  Query,
  Get,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AccessTokenPayload, Business, JwtAuthGuard, ParamModel, Roles, RolesEnum, User } from '@pe/nest-kit';
import { plainToClass } from 'class-transformer';
import { FastifyRequest } from 'fastify';
import { CheckoutIntegrationSubscriptionService, OauthService } from '../../../common/services';
import {
  ApiCallResultDto,
  PaymentMethodLimitsDto,
  HeadersHolderDto,
  TermsFilterRequestDto,
  PaymentMethodWithVariantsDto,
} from '../../dto';
import {
  ExternalApiExecutor,
  LegacyApiProcessor,
  LegacyApiResponseTransformerService,
  LegacyBusinessResolverService,
  PaymentMethodService,
  TermsService,
} from '../../services';
import { BusinessModel } from '../../../business';
import { CheckoutModel, CheckoutIntegrationSubModel } from '../../../checkout';
import { ChannelSetModel } from '../../../channel-set';
import { PaymentMethodResponseDto } from '../../dto/response/payment-method-response.dto';
import { PaymentMethodsTransformer } from '../../transformer';
import {
  IntegrationService,
  IntegrationModel,
  BusinessIntegrationSubscriptionService,
  BusinessIntegrationSubModel,
} from '../../../integration';
import { ApiBody } from '@nestjs/swagger/dist/decorators/api-body.decorator';
import { PaymentDataHelper } from '../../helpers';
import { PaymentMethodRequestDto } from '../../dto/request/v1';
import { CreatePaymentWrapperDto } from '../../dto/request/v2';
import { ConnectionSchemaName } from '../../../mongoose-schema';
import { CheckoutConnectionService, ConnectionModel } from '../../../connection';

@Controller('v2/payment')
@ApiTags('legacy-api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class V2PaymentController {
  constructor(
    private readonly oauthService: OauthService,
    private readonly responseTransformer: LegacyApiResponseTransformerService,
    private readonly logger: Logger,
    private readonly legacyApiProcessor: LegacyApiProcessor,
    private readonly legacyBusinessResolverService: LegacyBusinessResolverService,
    private readonly checkoutIntegrationService: CheckoutIntegrationSubscriptionService,
    private readonly paymentMethodService: PaymentMethodService,
    private readonly integrationService: IntegrationService,
    private readonly businessIntegrationSubscriptionService: BusinessIntegrationSubscriptionService,
    private readonly externalApiExecutor: ExternalApiExecutor,
    private readonly termService: TermsService,
    private readonly checkoutConnectionService: CheckoutConnectionService,
  ) { }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RolesEnum.oauth)
  @ApiBody({ type: CreatePaymentWrapperDto})
  public async createPayment(
    @Req() request: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
    @Body() dto: any,
  ): Promise<ApiCallResultDto> {
    let paymentDto: CreatePaymentWrapperDto = plainToClass(CreatePaymentWrapperDto, dto);
    if (!paymentDto) {
      paymentDto = new CreatePaymentWrapperDto();
    }

    return this.legacyApiProcessor.processV2CreateOrSubmitPayment({ request, targetBusinessId, user }, paymentDto);
  }

  @Post('/submit')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RolesEnum.oauth)
  @ApiBody({ type: CreatePaymentWrapperDto})
  public async submitPayment(
    @Req() request: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
    @Body() dto?: any,
  ): Promise<ApiCallResultDto> {
    let paymentDto: CreatePaymentWrapperDto = plainToClass(CreatePaymentWrapperDto, dto);
    if (!paymentDto) {
      paymentDto = new CreatePaymentWrapperDto();
    }

    return this.legacyApiProcessor.processV2SubmitPayment({ request, targetBusinessId, user }, paymentDto);
  }

  @Post('methods')
  @Roles(RolesEnum.oauth)
  @ApiBody({ type: PaymentMethodRequestDto})
  public async getPaymentMethods(
    @User() user: AccessTokenPayload,
    @Body() dto: PaymentMethodRequestDto,
  ): Promise<ApiCallResultDto> {
    let businessId: string;
    try {
      businessId = this.oauthService.getOauthUserBusiness(user, dto.businessId);
    } catch (e) {
      throw new ForbiddenException(`You're not allowed to get payment method list`);
    }

    const business: BusinessModel = await this.legacyBusinessResolverService.resolve(businessId);

    if (!business) {
      throw new NotFoundException(`Business with id "${businessId}" not found!`);
    }

    dto.businessId = dto.businessId ? dto.businessId : businessId;

    const [checkout, channelSet]: [CheckoutModel, ChannelSetModel] =
      await this.paymentMethodService.getCheckoutAndChannelSetByChannelType(
        business,
        dto.channel,
      );

    try {
      const checkoutIntegrationSubs: CheckoutIntegrationSubModel[] =
        await this.checkoutIntegrationService.getEnabledSubscriptions(checkout, business);

      const checkoutConnections: ConnectionModel[] =
        await this.checkoutConnectionService.getInstalledConnections(checkout, business);

      const enabledPaymentMethodsDto: PaymentMethodWithVariantsDto[] =
        await this.paymentMethodService.integrationToPaymentMethodDtoWithVariants(
          checkoutIntegrationSubs,
          checkoutConnections,
          dto.currency,
          dto.locale,
        );

      const filteredPaymentMethods: PaymentMethodWithVariantsDto[] =
        await this.paymentMethodService.filterPaymentMethods(
          enabledPaymentMethodsDto,
          dto,
        ) as PaymentMethodWithVariantsDto[];

      let paymentMethods: PaymentMethodResponseDto[] =
        PaymentMethodsTransformer.paymentMethodDtoToPaymentMethodResponseDto(
          filteredPaymentMethods,
          !dto.country,
          !dto.currency,
        );

      paymentMethods = this.paymentMethodService.sortPaymentMethods(paymentMethods, dto.sorting);

      return this.responseTransformer.successBusinessPaymentMethodsResponse(
        business,
        channelSet,
        paymentMethods,
      );
    } catch (e) {
      this.logger.log(
        {
          businessId: dto.businessId,
          channel: dto.channel,
          error: e.message,
          message: 'Failed to retrieve payment options by channel',
        },
      );

      return this.responseTransformer.failedBusinessPaymentMethodsResponse(business, channelSet, e.message);
    }
  }

  @Get('methods/limits')
  @Roles(RolesEnum.oauth)
  public async getPaymentMethodLimits(
    @User() user: AccessTokenPayload,
    @Query('type') paymentMethod: string,
    @Query('issuer') issuer?: string,
  ): Promise<ApiCallResultDto> {
    const integration: IntegrationModel = await this.integrationService.findOneByName(paymentMethod);
    if (!integration) {
      throw new NotFoundException(`Payment methods with name "${paymentMethod}" not found!`);
    }
    let businessId: string;
    try {
      businessId = this.oauthService.getOauthUserBusiness(user);
    } catch (e) {
      throw new ForbiddenException(`You're not allowed to get payment method settings.`);
    }
    const business: BusinessModel = await this.legacyBusinessResolverService.resolve(businessId);

    if (!business) {
      throw new NotFoundException(`Business with id "${businessId}" not found!`);
    }

    const businessIntegrationSub: BusinessIntegrationSubModel =
      await this.businessIntegrationSubscriptionService.findOneByIntegrationAndBusiness(integration, business);

    if (!businessIntegrationSub || !businessIntegrationSub.enabled || !businessIntegrationSub.installed) {
      throw new NotFoundException(`Payment methods with name "${paymentMethod}" not enabled in business.`);
    }

    try {
      const paymentMethodDto: PaymentMethodLimitsDto = await this.paymentMethodService.getBusinessPaymentMethod(
        paymentMethod,
        businessId,
        business.currency,
        issuer,
      );

      return this.responseTransformer.successBusinessPaymentMethodLimitsResponse(business, paymentMethodDto);
    } catch (e) {
      this.logger.log(
        {
          businessId: businessId,
          error: e.message,
          message: 'Failed to retrieve payment method',
        },
      );

      return this.responseTransformer.failedBusinessPaymentMethodLimitsResponse(business, e.message);
    }

  }

  @Post('/risk/:paymentMethod')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RolesEnum.oauth)
  public async getRiskSessionId(
    @Param('paymentMethod') paymentMethod: string,
    @Req() req: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
  ): Promise<ApiCallResultDto> {
    try {
      const businessId: string = this.oauthService.getOauthUserBusiness(user, targetBusinessId);
      const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(req);

      return this.externalApiExecutor.externalRiskSessionId(headersHolder, businessId, paymentMethod);
    } catch (e) {
      return this.responseTransformer.failedCustomErrorResponse(e.message, 'risk');
    }
  }

  @Post('/:variantId/terms')
  @Roles(RolesEnum.oauth)
  @ApiParam({ name: 'variantId' })
  public async getTerms(
    @ParamModel(
      {
        _id: ':variantId',
      },
      ConnectionSchemaName,
    ) connection: ConnectionModel,
    @Body() filterDto: TermsFilterRequestDto,
    @Req() req: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
  ): Promise<ApiCallResultDto> {

    const businessId: string = this.oauthService.getOauthUserBusiness(user, targetBusinessId);
    const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(req);

    if (connection.businessId !== businessId) {
      throw new ForbiddenException(`You are not allowed to get terms for variant ${connection.id}`);
    }

    await connection.populate('integration').execPopulate();
    const paymentMethod: string = connection.integration.name;

    return this.termService.getTermsForPaymentMethodAndFilter(
      paymentMethod,
      filterDto,
      headersHolder,
      businessId,
      connection,
    );
  }
}
