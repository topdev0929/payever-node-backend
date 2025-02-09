import { CheckoutFlowInterface } from './checkout-flow.interface';

export interface FullSettingResponseInterface extends CheckoutFlowInterface {
  channelType: string;
  customPolicy: boolean;
  policyEnabled: boolean;
  businessName: string;
  companyAddress: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
}
