import { IntegrationInterface } from './integration.interface';

export interface IntegrationSubscriptionInterface {
  integration: IntegrationInterface;
  installed?: boolean;
  enabled?: boolean;
}
