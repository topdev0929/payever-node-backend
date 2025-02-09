import { CheckoutLanguageInterface } from '..';
import { LimitsInterface } from '../../flow/interfaces/limits.interface';

export interface CheckoutFlowBaseInterface {
  businessUuid?: string;
  customerAccount: { }; // TODO Types
  enableCustomerAccount: boolean;
  enablePayeverTerms: boolean;
  enableLegalPolicy: boolean;
  enableDisclaimerPolicy: boolean;
  enableRefundPolicy: boolean;
  enableShippingPolicy: boolean;
  enablePrivacyPolicy: boolean;
  languages: CheckoutLanguageInterface[];
  message: string;
  name: string;
  paymentMethods: string[];
  phoneNumber: string;
  policies: { }; // TODO Types
  testingMode: boolean;
  limits: LimitsInterface;
  currency: string;
  uuid: string;
}
