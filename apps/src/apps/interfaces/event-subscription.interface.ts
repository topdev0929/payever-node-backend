export interface EventSubscriptionInterface {
  appId: string;
  businessId: string;
  connection: {
    type: string;
    [name: string]: string;
  };
  events: string[];
}
