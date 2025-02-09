import { IntegrationSubscriptionModel } from '..';

export interface ReportDataRequestTaskInterface {
  business: string;
  connectData?: IntegrationSubscriptionModel[];
}
