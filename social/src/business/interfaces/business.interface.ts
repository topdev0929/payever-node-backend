import { IntegrationSubscriptionInterface } from '../../integration/interfaces';

export interface BusinessInterface {
  integrationSubscriptions: IntegrationSubscriptionInterface[];
  currency: string;
}
