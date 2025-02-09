import {
  OnboardingPaymentCountryEnum,
  OnboardingPaymentDeviceEnum,
  OnboardingPaymentMethodEnum,
  OnboardingPaymentNameEnum,
} from '../enums';
import { ActionIntegrationInterface } from '../interfaces';

export class ActionIntegrationDto implements ActionIntegrationInterface{
  public integration?: string;
  public country?: OnboardingPaymentCountryEnum;
  public device?: OnboardingPaymentDeviceEnum;
  public method?: OnboardingPaymentMethodEnum;
  public name: OnboardingPaymentNameEnum;
}
