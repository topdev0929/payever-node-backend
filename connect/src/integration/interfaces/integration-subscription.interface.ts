import { BusinessInterface } from '../../business';
import { IntegrationInterface } from './integration.interface';

export interface IntegrationSubscriptionInterface {
  businessId?: string;
  business?: BusinessInterface;
  integration?: IntegrationInterface;
  installed?: boolean;
  payload?: any;
  scopes?: string[];
  createdAt?: Date;
}
