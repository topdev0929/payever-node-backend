import { IntegrationSubscriptionInterface } from './integration-subscription.interface';

export interface IntegrationPaginationInterface {
  integrations: IntegrationSubscriptionInterface[];
  total: number;
  business?: any;
}
