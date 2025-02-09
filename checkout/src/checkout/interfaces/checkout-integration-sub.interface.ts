import { IntegrationInterface } from '../../integration';
import { CheckoutInterface } from './checkout.interface';

export interface CheckoutIntegrationSubInterface {
  checkout?: CheckoutInterface;
  integration?: IntegrationInterface;
  installed?: boolean;
  options?: any;
}
