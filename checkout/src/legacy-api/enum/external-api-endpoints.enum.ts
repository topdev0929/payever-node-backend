import { PaymentMethodEnum } from './payment-method.enum';

export enum ExternalApiEndpointsEnum {
  companySearch = 'company-search',
  companyCreditLine = 'company-credit-line',
  onboardPurchaser = 'onboard-purchaser',
  updatePurchaser = 'update-purchaser',
  deletePurchaser = 'delete-purchaser',
  deactivatePurchaser = 'deactivate-purchaser',
  attachPurchaserAddress = 'attach-purchaser-address',
  triggerPurchaserVerification = 'trigger-verify',
  riskSession = 'risk-session',
  paymentPreInitialize = 'payment-pre-initialize',
}

export const AllowedApiEndpointsPaymentMethods: Map<ExternalApiEndpointsEnum, PaymentMethodEnum[]> =
  new Map<ExternalApiEndpointsEnum, PaymentMethodEnum[]>([
    [
      ExternalApiEndpointsEnum.companySearch,
      [PaymentMethodEnum.METHOD_ALLIANZ, PaymentMethodEnum.METHOD_SANTANDER_B2B],
    ],
    [
      ExternalApiEndpointsEnum.companyCreditLine,
      [PaymentMethodEnum.METHOD_ALLIANZ, PaymentMethodEnum.METHOD_SANTANDER_B2B],
    ],
    [
      ExternalApiEndpointsEnum.onboardPurchaser,
      [PaymentMethodEnum.METHOD_ALLIANZ, PaymentMethodEnum.METHOD_SANTANDER_B2B],
    ],
    [
      ExternalApiEndpointsEnum.updatePurchaser,
      [PaymentMethodEnum.METHOD_ALLIANZ, PaymentMethodEnum.METHOD_SANTANDER_B2B],
    ],
    [
      ExternalApiEndpointsEnum.deletePurchaser,
      [PaymentMethodEnum.METHOD_ALLIANZ, PaymentMethodEnum.METHOD_SANTANDER_B2B],
    ],
    [
      ExternalApiEndpointsEnum.deactivatePurchaser,
      [PaymentMethodEnum.METHOD_ALLIANZ, PaymentMethodEnum.METHOD_SANTANDER_B2B],
    ],
    [
      ExternalApiEndpointsEnum.attachPurchaserAddress,
      [PaymentMethodEnum.METHOD_ALLIANZ, PaymentMethodEnum.METHOD_SANTANDER_B2B],
    ],
    [
      ExternalApiEndpointsEnum.triggerPurchaserVerification,
      [PaymentMethodEnum.METHOD_ALLIANZ, PaymentMethodEnum.METHOD_SANTANDER_B2B],
    ],
    [
      ExternalApiEndpointsEnum.riskSession,
      [PaymentMethodEnum.METHOD_SANTANDER_DE_INVOICE, PaymentMethodEnum.METHOD_SANTANDER_DE_FACTORING],
    ],
    [
      ExternalApiEndpointsEnum.paymentPreInitialize,
      [PaymentMethodEnum.METHOD_APPLE_PAY, PaymentMethodEnum.METHOD_GOOGLE_PAY],
    ],
  ]);
