import { ConnectIntegrationInterface } from './connect-integration.interface';

export interface ConnectIntegrationSubscriptionInterface {
  businessId: string;
  installed: boolean;
  integration: ConnectIntegrationInterface;
}
