import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { plainToClass } from 'class-transformer';
import { Types } from 'mongoose';
import { BusinessModel } from '../../../business';
import { ChannelSetModel } from '../../../channel-set';
import { CheckoutIntegrationSubModel, CheckoutModel } from '../../../checkout';
import { ConnectionModel } from '../../../connection/models';
import { CheckoutConnectionService } from '../../../connection/services';
import {
  ApiCallFailedDto,
  ApiCallResultDto,
  BusinessCheckoutSettingsDto,
  ChannelSetDto,
  PaymentMethodWithVariantsDto,
} from '../../dto';
import { PaymentMethodDto } from '../../dto/response/payment-method.dto';
import {
  LegacyApiResponseTransformerService,
  LegacyBusinessResolverService,
  PaymentMethodService,
} from '../../services';
import { CheckoutIntegrationSubscriptionService, ChannelFilterService } from '../../../common/services';
import { BusinessCheckoutSettingsTransformer } from '../../transformer';

@Controller('shop')
@ApiTags('legacy-api')
export class ShopController {
  constructor(
    private readonly checkoutIntegrationService: CheckoutIntegrationSubscriptionService,
    private readonly paymentMethodService: PaymentMethodService,
    private readonly responseTransformer: LegacyApiResponseTransformerService,
    private readonly checkoutConnectionService: CheckoutConnectionService,
    private readonly legacyBusinessResolverService: LegacyBusinessResolverService,
    private readonly channelFilterService: ChannelFilterService,
    private readonly logger: Logger,
  ) { }

  @Get('/:businessUuid/payment-options/:channel')
  @ApiParam({ name: 'channel' })
  @ApiParam({ name: 'businessUuid' })
  public async listChannelSetActivePaymentOptions(
    @Param('businessUuid') businessId: string,
    @Param('channel') channel: string,
    @Query('_currency') currency: string = 'EUR',
    @Query('locale') locale: string = 'en',
  ): Promise<ApiCallResultDto> {
    if (!channel) {
      throw new NotFoundException('Missing "channel" parameter');
    }

    const business: BusinessModel = await this.tryToFindBusinessBySlugOrUuid(businessId);

    const [checkout, channelSet]: [CheckoutModel, ChannelSetModel] =
      await this.paymentMethodService.getCheckoutAndChannelSetByChannelType(business, channel);

    try {
      const checkoutIntegrationSubs: CheckoutIntegrationSubModel[] =
        await this.checkoutIntegrationService.getEnabledSubscriptions(checkout, business);

      let enabledPaymentMethodsDto: PaymentMethodDto[] =
        await this.paymentMethodService.integrationToPaymentMethodDto(
          checkoutIntegrationSubs,
          currency,
          locale,
        );

      enabledPaymentMethodsDto = await this.channelFilterService.filter(
        channel,
        enabledPaymentMethodsDto,
      ) as PaymentMethodDto[];

      return this.responseTransformer.successBusinessPaymentOptionsResponse(
        business,
        channelSet,
        enabledPaymentMethodsDto,
      );
    } catch (e) {
      this.logger.log(
        {
          businessId: businessId,
          channel,
          error: e.message,
          message: 'Failed to retrieve payment options by channel',
        },
      );

      return this.responseTransformer.failedBusinessPaymentOptionsResponse(business, channelSet, e.message);
    }
  }

  @Get('/:businessUuid/settings/:channel')
  @ApiParam({ name: 'channel' })
  @ApiParam({ name: 'businessUuid' })
  public async businessSettings(
    @Param('businessUuid') businessId: string,
    @Param('channel') channel: string,
  ): Promise<BusinessCheckoutSettingsDto | ApiCallFailedDto> {
    if (!channel) {
      throw new NotFoundException('Missing "channel" parameter');
    }

    const business: BusinessModel = await this.tryToFindBusinessBySlugOrUuid(businessId);
    await business.populate('businessDetail').execPopulate();

    const [checkout, channelSet]: [CheckoutModel, ChannelSetModel] =
      await this.paymentMethodService.getCheckoutAndChannelSetByChannelType(business, channel);

    try {
      const checkoutIntegrationSubs: CheckoutIntegrationSubModel[] =
        await this.checkoutIntegrationService.getEnabledSubscriptions(checkout, business);

      let enabledPaymentMethodsDto: PaymentMethodDto[] =
        await this.paymentMethodService.integrationToPaymentMethodDto(
          checkoutIntegrationSubs,
          'EUR',
          'en',
        );

      enabledPaymentMethodsDto = await this.channelFilterService.filter(
        channel,
        enabledPaymentMethodsDto,
      ) as PaymentMethodDto[];

      return BusinessCheckoutSettingsTransformer.checkoutToSettingsResponse(
        business,
        checkout,
        enabledPaymentMethodsDto,
      );
    } catch (e) {
      this.logger.log(
        {
          businessId: businessId,
          channel,
          error: e.message,
          message: 'Failed to retrieve business settings by channel',
        },
      );

      return this.responseTransformer.failedBusinessPaymentOptionsResponse(business, channelSet, e.message);
    }
  }

  @Get('/oauth/:businessUuid/payment-options/:channel')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.oauth)
  public async listChannelSetActivePaymentOptionsOauth(
    @Param('businessUuid') businessId: string,
    @Param('channel') channel: string,
    @Query('_currency') currency: string = 'EUR',
    @Query('locale') locale: string = 'en',
  ): Promise<ApiCallResultDto> {
    return this.listChannelSetActivePaymentOptions(businessId, channel, currency, locale);
  }

  @Get('/:businessUuid/payment-options/variants/:channel')
  public async listChannelSetActivePaymentOptionsWithVariants(
    @Param('businessUuid') businessId: string,
    @Param('channel') channel: string,
    @Query('_currency') currency: string = 'EUR',
    @Query('locale') locale: string = 'en',
  ): Promise<ApiCallResultDto> {

    const business: BusinessModel = await this.tryToFindBusinessBySlugOrUuid(businessId);

    const [checkout, channelSet]: [CheckoutModel, ChannelSetModel] =
      await this.paymentMethodService.getCheckoutAndChannelSetByChannelType(business, channel);

    try {
      const checkoutIntegrationSubs: CheckoutIntegrationSubModel[] =
        await this.checkoutIntegrationService.getEnabledSubscriptions(checkout, business);

      const checkoutConnections: ConnectionModel[] =
        await this.checkoutConnectionService.getInstalledConnections(checkout, business);

      let enabledPaymentMethodsWithVariantsDto: PaymentMethodWithVariantsDto[] =
        await this.paymentMethodService.integrationToPaymentMethodDtoWithVariants(
          checkoutIntegrationSubs,
          checkoutConnections,
          currency,
          locale,
        );

      enabledPaymentMethodsWithVariantsDto = await this.channelFilterService.filter(
        channel,
        enabledPaymentMethodsWithVariantsDto,
      ) as PaymentMethodWithVariantsDto[];

      return this.responseTransformer.successBusinessPaymentOptionsResponse(
        business,
        channelSet,
        enabledPaymentMethodsWithVariantsDto,
      );
    } catch (e) {
      this.logger.log(
        {
          businessId: businessId,
          channel,
          error: e.message,
          message: 'Failed to retrieve payment options variants by channel',
        },
      );

      return this.responseTransformer.failedBusinessPaymentOptionsResponse(business, channelSet, e.message);
    }
  }

  @Get('/oauth/:businessUuid/payment-options/variants/:channel')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.oauth)
  public async listChannelSetActivePaymentOptionsWithVariantsOauth(
    @Param('businessUuid') businessId: string,
    @Param('channel') channel: string,
    @Query('_currency') currency: string = 'EUR',
    @Query('locale') locale: string = 'en',
  ): Promise<ApiCallResultDto> {
    return this.listChannelSetActivePaymentOptionsWithVariants(businessId, channel, currency, locale);
  }

  @Get('/:businessUuid/channel-sets')
  public async listBusinessChannelSets(
    @Param('businessUuid') businessId: string,
  ): Promise<ApiCallResultDto> {
    const business: BusinessModel = await this.tryToFindBusinessBySlugOrUuid(businessId);

    try {
      await business.populate('channelSets').execPopulate();
      const channelSets: Types.DocumentArray<ChannelSetModel>
        = business.channelSets as Types.DocumentArray<ChannelSetModel>;
      const channelSetsDTOs: ChannelSetDto[] = channelSets.toObject().map(
        (channelSet: ChannelSetModel) => plainToClass<ChannelSetDto, ChannelSetModel>(ChannelSetDto, channelSet),
      );

      return this.responseTransformer.successBusinessChannelSetsResponse(business, channelSetsDTOs);
    } catch (e) {
      return this.responseTransformer.failedBusinessChannelSetsResponse(business, e.message);
    }
  }

  @Get('/oauth/:businessUuid/channel-sets')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.oauth)
  public async listBusinessChannelSetsOauth(
    @Param('businessUuid') businessId: string,
  ): Promise<ApiCallResultDto> {
    return this.listBusinessChannelSets(businessId);
  }

  private async tryToFindBusinessBySlugOrUuid(slugOrUuid: string): Promise<BusinessModel> {
    const business: BusinessModel = await this.legacyBusinessResolverService.resolve(slugOrUuid);

    if (!business) {
      throw new NotFoundException(`Business with id "${slugOrUuid}" not found!`);
    }

    return business;
  }

}
