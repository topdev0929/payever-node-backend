export interface ExchangeBindingInterface {
  source: string;
  vhost: string;
  destination: string;
  destination_type: string;
  routing_key: string;
  arguments: any;
  properties_key: string;
}
