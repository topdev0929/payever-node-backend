/* eslint-disable @typescript-eslint/tslint/config */
import { BusinessCheckoutSettingsDto } from '../dto';
import { BusinessModel } from '../../business';
import { CheckoutModel } from '../../checkout';
import { PaymentMethodDto } from '../dto/response/payment-method.dto';
import { FlowToResponseTransformer } from '../../flow';

export class BusinessCheckoutSettingsTransformer {
  public static checkoutToSettingsResponse(
    business: BusinessModel,
    checkout: CheckoutModel,
    enabledPaymentMethodsDto: PaymentMethodDto[],
  ): BusinessCheckoutSettingsDto {
    return {
      name: business?.name,
      type: checkout?.settings?.businessType,
      b2b_search: FlowToResponseTransformer.isB2bSearchAllowed(enabledPaymentMethodsDto),
      languages: checkout?.settings?.languages,
      testing_mode: checkout?.settings?.testingMode,
      company_address: {
        city: business?.businessDetail?.companyAddress?.city,
        country: business?.businessDetail?.companyAddress?.country,
        street: business?.businessDetail?.companyAddress?.street,
        zip_code: business?.businessDetail?.companyAddress?.zipCode,
      },
    };
  }
}
