import {
  OnboardingPaymentCountryEnum,
  OnboardingPaymentDeviceEnum,
  OnboardingPaymentMethodEnum,
  OnboardingPaymentNameEnum,
} from '../enums';

export interface ActionIntegrationInterface {
  integration?: string;
  country?: OnboardingPaymentCountryEnum;
  device?: OnboardingPaymentDeviceEnum;
  method?: OnboardingPaymentMethodEnum;
  name: OnboardingPaymentNameEnum;
}
