import { IntegrationInterface } from './integration.interface';
import { BusinessInterface } from '@pe/business-kit';
import { PaymentMethodsEnum } from '../enums';

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
