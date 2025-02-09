import { CheckoutInterface } from '../../checkout';
import { BusinessIntegrationSubModel } from '../../integration';

export interface CombinedCheckoutStatInterface {
  channels: BusinessIntegrationSubModel[];
  checkout: CheckoutInterface[];
  paymentOptions: BusinessIntegrationSubModel[];
}
