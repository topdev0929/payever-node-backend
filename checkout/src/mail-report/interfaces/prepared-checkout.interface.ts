import { CombinedCheckoutStatInterface } from './combined-checkout-stat.interface';
import { CombinedPaymentOptionsInterface } from './combined-payment-options.interface';

export interface PreparedCheckoutInterface {
  business: string;
  checkoutStat: CombinedCheckoutStatInterface;
  posPaymentOptions: CombinedPaymentOptionsInterface[];
}
