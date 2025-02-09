import {
  OnboardingPaymentCountryEnum,
  OnboardingPaymentMethodEnum,
  OnboardingPaymentNameEnum,
  OnboardingPaymentDeviceEnum,
} from '../src/onboarding/enums';
import { ActionIntegrationInterface } from '../src/onboarding/interfaces/action-integration.interface';

export const PaymentDefaultAppsInstantPaymentFixture: ActionIntegrationInterface[] = [
  {
    integration: 'instant_payment',
    name: OnboardingPaymentNameEnum.instantPayment,
  },
];

export const PaymentDefaultAppsPaypalFixture: ActionIntegrationInterface[] = [
  {
    integration: 'paypal',
    name: OnboardingPaymentNameEnum.paypal,
  },
];

export const PaymentDefaultAppsSofortFixture: ActionIntegrationInterface[] = [
  {
    integration: 'sofort',
    name: OnboardingPaymentNameEnum.sofort,
  },
];

export const PaymentDefaultAppsStripeFixture: ActionIntegrationInterface[] = [
  {
    integration: 'stripe',
    method: OnboardingPaymentMethodEnum.creditcard,
    name: OnboardingPaymentNameEnum.stripe,
  },
  {
    integration: 'stripe_directdebit',
    method: OnboardingPaymentMethodEnum.directdebit,
    name: OnboardingPaymentNameEnum.stripe,
  },
];

export const PaymentDefaultAppsSantanderFixture: ActionIntegrationInterface[] = [
  {
    country: OnboardingPaymentCountryEnum.de,
    integration: 'santander_invoice_de',
    method: OnboardingPaymentMethodEnum.invoice,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.nl,
    integration: 'santander_installment_nl',
    method: OnboardingPaymentMethodEnum.installment,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.at,
    integration: 'santander_installment_at',
    method: OnboardingPaymentMethodEnum.installment,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.de,
    integration: 'santander_invoice_de',
    method: OnboardingPaymentMethodEnum.invoice,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.de,
    device: OnboardingPaymentDeviceEnum.pos,
    integration: 'santander_pos_invoice_de',
    method: OnboardingPaymentMethodEnum.invoice,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.de,
    integration: 'santander_factoring_de',
    method: OnboardingPaymentMethodEnum.factoring,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.de,
    device: OnboardingPaymentDeviceEnum.pos,
    integration: 'santander_pos_factoring_de',
    method: OnboardingPaymentMethodEnum.factoring,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.dk,
    integration: 'santander_installment_dk',
    method: OnboardingPaymentMethodEnum.installment,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.dk,
    device: OnboardingPaymentDeviceEnum.pos,
    integration: 'santander_pos_installment_dk',
    method: OnboardingPaymentMethodEnum.installment,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.se,
    integration: 'santander_installment_se',
    method: OnboardingPaymentMethodEnum.installment,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.se,
    device: OnboardingPaymentDeviceEnum.pos,
    integration: 'santander_pos_installment_se',
    method: OnboardingPaymentMethodEnum.installment,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.de,
    device: OnboardingPaymentDeviceEnum.ccp,
    integration: 'santander_ccp_installment',
    method: OnboardingPaymentMethodEnum.installment,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.de,
    integration: 'santander_installment',
    method: OnboardingPaymentMethodEnum.installment,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.de,
    device: OnboardingPaymentDeviceEnum.pos,
    integration: 'santander_pos_installment',
    method: OnboardingPaymentMethodEnum.installment,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.no,
    integration: 'santander_installment_no',
    method: OnboardingPaymentMethodEnum.installment,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.no,
    device: OnboardingPaymentDeviceEnum.pos,
    integration: 'santander_pos_installment_no',
    method: OnboardingPaymentMethodEnum.installment,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.no,
    integration: 'santander_invoice_no',
    method: OnboardingPaymentMethodEnum.invoice,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.uk,
    integration: 'santander_installment_uk',
    method: OnboardingPaymentMethodEnum.installment,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.uk,
    device: OnboardingPaymentDeviceEnum.pos,
    integration: 'santander_pos_installment_uk',
    method: OnboardingPaymentMethodEnum.installment,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.fi,
    integration: 'santander_installment_fi',
    method: OnboardingPaymentMethodEnum.installment,
    name: OnboardingPaymentNameEnum.santander,
  },
  {
    country: OnboardingPaymentCountryEnum.fi,
    device: OnboardingPaymentDeviceEnum.pos,
    integration: 'santander_pos_installment_fi',
    method: OnboardingPaymentMethodEnum.installment,
    name: OnboardingPaymentNameEnum.santander,
  },
];

export const PaymentDefaultAppsSwedbankFixture: ActionIntegrationInterface[] = [
  {
    integration: 'swedbank_creditcard',
    method: OnboardingPaymentMethodEnum.creditcard,
    name: OnboardingPaymentNameEnum.swedbank,
  },
  {
    integration: 'swedbank_invoice',
    method: OnboardingPaymentMethodEnum.invoice,
    name: OnboardingPaymentNameEnum.swedbank,
  },
];

export const PaymentDefaultAppsCashFixture: ActionIntegrationInterface[] = [
  {
    integration: 'cash',
    name: OnboardingPaymentNameEnum.cash,
  },
];

export const PaymentDefaultAppsApplePayFixture: ActionIntegrationInterface[] = [
  {
    integration: 'apple_pay',
    name: OnboardingPaymentNameEnum.applePay,
  },
];

export const PaymentDefaultAppsGooglePayFixture: ActionIntegrationInterface[] = [
  {
    integration: 'google_pay',
    name: OnboardingPaymentNameEnum.googlePay,
  },
];

export const PaymentDefaultAppsPayexFixture: ActionIntegrationInterface[] = [
  {
    integration: 'payex_creditcard',
    method: OnboardingPaymentMethodEnum.creditcard,
    name: OnboardingPaymentNameEnum.payEx,
  },
  {
    integration: 'payex_faktura',
    name: OnboardingPaymentNameEnum.payEx,
  },
];

export const PaymentDefaultAppsZiniaFixture: ActionIntegrationInterface[] = [
  {
    country: OnboardingPaymentCountryEnum.nl,
    integration: 'zinia_bnpl',
    method: OnboardingPaymentMethodEnum.bnpl,
    name: OnboardingPaymentNameEnum.zinia,
  },
  {
    country: OnboardingPaymentCountryEnum.nl,
    integration: 'zinia_pos',
    method: OnboardingPaymentMethodEnum.pos,
    name: OnboardingPaymentNameEnum.zinia,
  },
  {
    country: OnboardingPaymentCountryEnum.nl,
    integration: 'zinia_slice_three',
    method: OnboardingPaymentMethodEnum.sliceThree,
    name: OnboardingPaymentNameEnum.zinia,
  },
  {
    country: OnboardingPaymentCountryEnum.nl,
    integration: 'zinia_installment',
    method: OnboardingPaymentMethodEnum.installment,
    name: OnboardingPaymentNameEnum.zinia,
  },
  {
    country: OnboardingPaymentCountryEnum.de,
    integration: 'zinia_bnpl_de',
    method: OnboardingPaymentMethodEnum.bnpl,
    name: OnboardingPaymentNameEnum.zinia,
  },
  {
    country: OnboardingPaymentCountryEnum.de,
    integration: 'zinia_pos_de',
    method: OnboardingPaymentMethodEnum.pos,
    name: OnboardingPaymentNameEnum.zinia,
  },
  {
    country: OnboardingPaymentCountryEnum.de,
    integration: 'zinia_slice_three_de',
    method: OnboardingPaymentMethodEnum.sliceThree,
    name: OnboardingPaymentNameEnum.zinia,
  },
  {
    country: OnboardingPaymentCountryEnum.de,
    integration: 'zinia_installment_de',
    method: OnboardingPaymentMethodEnum.installment,
    name: OnboardingPaymentNameEnum.zinia,
  },
];
export const PaymentFixtures: ActionIntegrationInterface[] = [
  ...PaymentDefaultAppsStripeFixture,
  ...PaymentDefaultAppsSantanderFixture,
  ...PaymentDefaultAppsZiniaFixture,
  ...PaymentDefaultAppsInstantPaymentFixture,
  ...PaymentDefaultAppsSwedbankFixture,
  ...PaymentDefaultAppsPaypalFixture,
  ...PaymentDefaultAppsSofortFixture,
  ...PaymentDefaultAppsCashFixture,
  ...PaymentDefaultAppsApplePayFixture,
  ...PaymentDefaultAppsGooglePayFixture,
  ...PaymentDefaultAppsPayexFixture,
];
