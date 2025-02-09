export enum EventSubscriptionConnectionTypeEnum {
  AWSSQS = 'aws-sqs',
  AWSSNS = 'aws-sns',

  AzureServiceBus = 'azure-service-bus',
  AzureEventGrid = 'azure-event-grid',

  GoogleCloudPubSub = 'google-cloud-pub-sub',

  RabbitMQ = 'rabbitmq',
  Webhook = 'webhook',
}
