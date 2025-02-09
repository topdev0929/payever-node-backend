import { PaymentMethodsEnum } from '../../subscriptions/enums';
import { IntegrationInterface } from './integration.interface';
import { BusinessInterface } from '../../business';

/**
 * @aka payment option
 */
export interface ConnectionInterface {
  business?: BusinessInterface;
  businessId: string;
  integration: IntegrationInterface;
  isEnabled: boolean;
  integrationName: PaymentMethodsEnum;
}
