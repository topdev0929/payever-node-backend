import { IntegrationInterface } from './integration.interface';

export interface BusinessIntegrationSubInterface {
  businessId?: string;
  integration?: IntegrationInterface;

  enabled?: boolean;
  installed?: boolean;
  options?: any;
}
