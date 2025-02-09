import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CheckoutIntegrationSubModel, CheckoutModel } from '../../checkout';
import { ConnectionOptionsInterface } from '../../connection/interfaces';
import { ConnectionModel } from '../../connection/models';
import { IntegrationCategory } from '../../integration';
import { PaymentMethodWithVariantsDto, PaymentMethodLimitsDto } from '../dto';
import { PaymentMethodDto } from '../dto/response/payment-method.dto';
import { PaymentMethodAddressRequestInterface } from '../interfaces';
import { BusinessModel } from '../../business';
import { ChannelSetModel, ChannelSetService } from '../../channel-set';
import { TranslationService } from '@pe/translations-sdk';
import { PaymentMethodResponseDto } from '../dto/response/payment-method-response.dto';
import { BusinessAmountLimitsService, BusinessAmountLimitsDto } from '../../connection';
import { CheckoutDbService, CurrencyExchangeService } from '../../common/services';
import { PaymentMethodInterface, PaymentMethodLimitsInterface } from '../../common/interfaces';
import { PaymentMethodsConfigs } from '../../common/config';
import { PaymentMethodConfigDto } from '../../common/dto';
import { PaymentMethodRequestDto, PaymentMethodSortingRequestDto } from '../dto/request/v1';

@Injectable()
export class PaymentMethodService {
  constructor(
    private readonly currencyService: CurrencyExchangeService,
    private readonly checkoutDbService: CheckoutDbService,
    @Inject(forwardRef(() => ChannelSetService))
    private readonly channelSetService: ChannelSetService,
    private readonly translationService: TranslationService,
    private readonly businessAmountLimitsService: BusinessAmountLimitsService,
  ) { }

  public async integrationToPaymentMethodDto(
    checkoutIntegrationSubs: CheckoutIntegrationSubModel[],
    currency: string,
    locale: string,
  ): Promise<PaymentMethodDto[]> {
    const enabledPaymentMethods: PaymentMethodConfigDto[] =
      await this.getEnabledPaymentMethods(checkoutIntegrationSubs, locale);

    return Promise.all(
      enabledPaymentMethods.map((paymentMethodModel: PaymentMethodInterface) =>
        this.paymentMethodModelToDto(paymentMethodModel, currency),
      ),
    );
  }

  public async getAllAvailablePaymentMethods(
    currency?: string,
  ): Promise<PaymentMethodDto[]> {
    return Promise.all(
      PaymentMethodsConfigs.map((paymentMethod: PaymentMethodInterface) =>
        this.paymentMethodModelToDto(paymentMethod, currency),
      ),
    );
  }

  public async integrationToPaymentMethodDtoWithVariants(
    checkoutIntegrationSubs: CheckoutIntegrationSubModel[],
    checkoutConnections: ConnectionModel[],
    currency: string,
    locale: string,
  ): Promise<PaymentMethodWithVariantsDto[]> {
    const enabledPaymentMethods: PaymentMethodConfigDto[] =
      await this.getEnabledPaymentMethods(checkoutIntegrationSubs, locale);

    return Promise.all(
      enabledPaymentMethods.map((paymentMethodModel: PaymentMethodInterface) =>
        this.paymentMethodModelToDtoWithVariants(paymentMethodModel, checkoutConnections, currency),
      ),
    );
  }

  public async getCheckoutAndChannelSetByChannelType(
    business: BusinessModel,
    channel: string,
  ): Promise<[CheckoutModel, ChannelSetModel]> {
    const isChannelTypeUsed: boolean = channel.match(/^[\w\d]+$/) !== null;

    if (isChannelTypeUsed) {
      return this.prepareDataByChannelType(business, channel);
    } else {
      return this.prepareDataByChannelSetUuid(business, channel);
    }
  }

  // tslint:disable-next-line:cognitive-complexity
  public async filterPaymentMethods(
    paymentMethods: PaymentMethodDto[],
    paymentMethodsRequest: PaymentMethodRequestDto,
  ): Promise<PaymentMethodDto[]> {
    let filteredPaymentMethods: PaymentMethodDto[] = paymentMethods;

    if (paymentMethodsRequest.blockedPaymentMethods && paymentMethodsRequest.blockedPaymentMethods.length) {
      filteredPaymentMethods = filteredPaymentMethods.filter(
        (paymentMethod: PaymentMethodDto) =>
          !paymentMethodsRequest.blockedPaymentMethods.includes(paymentMethod.payment_method),
      );
    }

    if (paymentMethodsRequest.country) {
      filteredPaymentMethods = filteredPaymentMethods.filter(
        (paymentMethod: PaymentMethodDto) => paymentMethod.options.countries.length
            ? paymentMethod.options.countries.includes(paymentMethodsRequest.country)
            : true,
      );
    }

    if (paymentMethodsRequest.currency) {
      filteredPaymentMethods = filteredPaymentMethods.filter(
        (paymentMethod: PaymentMethodDto) => paymentMethod.options.currencies.length
          ? paymentMethod.options.currencies.includes(paymentMethodsRequest.currency)
          : true,
      );
    }

    if (paymentMethodsRequest.amount) {
      const filteredByAmounts: PaymentMethodDto[] = [];

      for (const filteredPaymentMethod of filteredPaymentMethods) {
        const businessLimits: BusinessAmountLimitsDto = await this.businessAmountLimitsService.getBusinessLimits(
          paymentMethodsRequest.businessId,
          filteredPaymentMethod.payment_method,
        );

        const minAmount: number = businessLimits && businessLimits.min ? businessLimits.min : filteredPaymentMethod.min;
        const maxAmount: number = businessLimits && businessLimits.max ? businessLimits.max : filteredPaymentMethod.max;

        if (paymentMethodsRequest.amount >= minAmount && paymentMethodsRequest.amount <= maxAmount) {
          filteredPaymentMethod.min = minAmount;
          filteredPaymentMethod.max = maxAmount;
          filteredByAmounts.push(filteredPaymentMethod);
        }
      }
      filteredPaymentMethods = filteredByAmounts;
    }

    if (paymentMethodsRequest.billingAddress && paymentMethodsRequest.shippingAddress) {
      filteredPaymentMethods = filteredPaymentMethods.filter(
        (paymentMethod: PaymentMethodDto) => paymentMethod.shipping_address_equality
          ? this.compareAddresses(paymentMethodsRequest.billingAddress, paymentMethodsRequest.shippingAddress)
          : true,
      );
    }

    return filteredPaymentMethods;
  }

  public sortPaymentMethods(
    paymentMethods: PaymentMethodResponseDto[],
    sorting?: PaymentMethodSortingRequestDto,
  ): PaymentMethodResponseDto[] {
    if (!sorting || !paymentMethods.length) {
      return paymentMethods;
    }

    return paymentMethods.sort((a: PaymentMethodResponseDto, b: PaymentMethodResponseDto) => {
      const direction: number = sorting.direction === 'asc' ? 1 : -1;

      return a.name.toLowerCase() > b.name.toLowerCase()
        ? direction
        : a.name.toLowerCase() === b.name.toLowerCase()
          ? 0
          : -direction;
    });

  }

  public async getBusinessPaymentMethod(
    paymentMethodName: string,
    businessId: string,
    currency: string = 'EUR',
    issuer?: string,
  ): Promise<PaymentMethodLimitsDto> {
    const paymentMethod: PaymentMethodInterface =
      PaymentMethodsConfigs.find((item: PaymentMethodInterface) => {
        return item.payment_method === paymentMethodName && item.payment_issuer === issuer;
      });
    
    const paymentMethodModel: PaymentMethodConfigDto = plainToClass(PaymentMethodConfigDto, paymentMethod);
    const paymentMethodDto: PaymentMethodDto = await this.paymentMethodModelToDto(paymentMethodModel, currency);

    const businessLimits: BusinessAmountLimitsDto = await this.businessAmountLimitsService.getBusinessLimits(
      businessId,
      paymentMethodName,
      issuer,
    );
    
    const minAmount: number = businessLimits && businessLimits.min ? businessLimits.min : paymentMethodDto.min;
    const maxAmount: number = businessLimits && businessLimits.max ? businessLimits.max : paymentMethodDto.max;
    paymentMethodDto.min = minAmount;
    paymentMethodDto.max = maxAmount;

    return {
      max: maxAmount,
      min: minAmount,
      options: paymentMethodDto.options,
      shipping_address_allowed: paymentMethod.shipping_address_allowed,
      shipping_address_equality: paymentMethod.shipping_address_equality,
    };
  }

  private async paymentMethodModelToDto(
    paymentMethodModel: PaymentMethodConfigDto,
    currency?: string,
  ): Promise<PaymentMethodDto> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { amount_limits, ...dtoFields }: { amount_limits: PaymentMethodLimitsInterface } = paymentMethodModel;
    currency = currency ? currency : 'EUR';

    return {
      ...dtoFields,
      max: await this.currencyService.exchangePaymentMethodLimits(currency, amount_limits.max),
      min: await this.currencyService.exchangePaymentMethodLimits(currency, amount_limits.min),
    } as PaymentMethodDto;
  }

  private async paymentMethodModelToDtoWithVariants(
    paymentMethodModel: PaymentMethodConfigDto,
    checkoutConnections: ConnectionModel[],
    currency: string,
  ): Promise<PaymentMethodWithVariantsDto> {
    const paymentMethodWithVariantsDto: PaymentMethodWithVariantsDto =
      await this.paymentMethodModelToDto(paymentMethodModel, currency) as PaymentMethodWithVariantsDto;
    
    paymentMethodWithVariantsDto.variants = [];
    
    for (const connection of checkoutConnections) {
      
      if (connection.integration.name === paymentMethodModel.payment_method
        && connection.integration.issuer === paymentMethodModel.payment_issuer) {
        const connectionOptions: ConnectionOptionsInterface = connection.options;
        const shippingAddressAllowed: boolean =
          connectionOptions.shippingAddressAllowed !== undefined && connectionOptions.shippingAddressAllowed !== null
            ? connectionOptions.shippingAddressAllowed
            : paymentMethodWithVariantsDto.shipping_address_allowed;
        const shippingAddressEquality: boolean =
          connectionOptions.shippingAddressEquality !== undefined && connectionOptions.shippingAddressEquality !== null
            ? connectionOptions.shippingAddressEquality
            : paymentMethodWithVariantsDto.shipping_address_equality;
        
        if (connectionOptions.maxAmount) {
          paymentMethodWithVariantsDto.max = connectionOptions.maxAmount;
        }
        
        if (connectionOptions.minAmount) {
          paymentMethodWithVariantsDto.min = connectionOptions.minAmount;
        }
        
        paymentMethodWithVariantsDto.variants.push({
          accept_fee: connectionOptions.acceptFee !== undefined ? connectionOptions.acceptFee : true,
          name: connection.name,
          options: {
            countries: connectionOptions.countryLimits?.length
              ? connectionOptions.countryLimits
              : paymentMethodWithVariantsDto.options.countries,
            currencies: paymentMethodWithVariantsDto.options.currencies,
          },
          shipping_address_allowed: shippingAddressAllowed,
          shipping_address_equality: shippingAddressEquality,
          variant_id: connection.id,
        });
      }
    }

    return paymentMethodWithVariantsDto;
  }

  private async getEnabledPaymentMethods(
    checkoutIntegrationSubs: CheckoutIntegrationSubModel[],
    locale: string,
  ): Promise<PaymentMethodConfigDto[]> {

    const enabledPaymentMethods: PaymentMethodInterface[] = checkoutIntegrationSubs
      .filter(
        (subscription: CheckoutIntegrationSubModel) =>
          subscription.integration.category === IntegrationCategory.Payments,
      )
      .map((subscription: CheckoutIntegrationSubModel) => {
        return PaymentMethodsConfigs.find((paymentMethod: PaymentMethodInterface) => {
          return paymentMethod.payment_method === subscription.integration.name &&
            paymentMethod.payment_issuer === subscription.integration.issuer;
        });
      });

    const translatedPaymentMethods: PaymentMethodInterface[] = [];
    for (const paymentMethod of enabledPaymentMethods) {
      const translatedPaymentMethod: PaymentMethodInterface = {
        ...paymentMethod,
        description_fee: await this.translationService.getTranslation(paymentMethod.description_fee, locale),
        description_offer: await this.translationService.getTranslation(paymentMethod.description_offer, locale),
        name: await this.translationService.getTranslation(paymentMethod.name, locale),
      };
      translatedPaymentMethods.push(translatedPaymentMethod);
    }

    return translatedPaymentMethods.map((paymentMethod: PaymentMethodInterface) =>
      plainToClass(PaymentMethodConfigDto, paymentMethod),
    );
  }

  private async prepareDataByChannelType(
    business: BusinessModel,
    channel: string,
  ): Promise<[CheckoutModel, ChannelSetModel]> {
    const defaultCheckout: CheckoutModel = await this.checkoutDbService.findDefaultForBusiness(business);
    const channelSet: ChannelSetModel =
      await this.channelSetService.findDefaultForBusiness(business, channel, defaultCheckout);

    if (!channelSet) {
      throw new NotFoundException(`Business ChannelSet with type '${channel}' not found`);
    }

    await channelSet.populate('checkout').execPopulate();
    if (!channelSet.checkout) {
      throw new BadRequestException(`Channel '${channel}' is not linked to checkout`);
    }

    const checkout: CheckoutModel = await this.checkoutDbService.findOneById(channelSet.checkout.id);

    return [checkout, channelSet];
  }

  private async prepareDataByChannelSetUuid(
    business: BusinessModel,
    channelSetUuid: string,
  ): Promise<[CheckoutModel, ChannelSetModel]> {
    const channelSet: ChannelSetModel = await this.channelSetService.findOneByIdOrOriginalId(channelSetUuid);
    if (!channelSet) {
      throw new NotFoundException(`ChannelSet with id ${channelSetUuid} not found`);
    }

    await channelSet.populate('checkout').execPopulate();
    if (!channelSet.checkout) {
      throw new BadRequestException(`Channel '${channelSetUuid}' is not linked to checkout`);
    }

    const checkout: CheckoutModel = await this.checkoutDbService.findOneById(channelSet.checkout.id);
    if (checkout.businessId !== business.id) {
      throw new ForbiddenException('Channel set does not belong to business');
    }

    return [checkout, channelSet];
  }

  private compareAddresses(
    source: PaymentMethodAddressRequestInterface,
    matched: PaymentMethodAddressRequestInterface,
  ): boolean {
    return source.country === matched.country &&
      source.city === matched.city &&
      source.zip === matched.zip &&
      source.street === matched.street &&
      source.firstName === matched.firstName &&
      source.lastName === matched.lastName;
  }
}
