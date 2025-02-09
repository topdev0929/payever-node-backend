export enum MessageBusChannelsEnum {
  apps = 'async_events_apps_micro',
}

export enum MessageBusEventsEnum {
  AppCreated = 'apps.event.app.created',
  AppUpdated = 'apps.event.app.updated',
  AppDeleted = 'apps.event.app.deleted',
  AppExported = 'apps.event.app.exported',

  EventSubscriptionUpdated = 'apps.event.event-subscription.updated',
  EventSubscriptionExported = 'apps.event.event-subscription.exported',

  ConnectIntegrationSubscriptionCreated = 'connect.event.integration.subscription.created',
  ConnectIntegrationSubscriptionUpdated = 'connect.event.integration.subscription.updated',
  ConnectIntegrationSubscriptionDeleted = 'connect.event.integration.subscription.deleted',
  ConnectIntegrationSubscriptionExported = 'connect.event.integration.subscription.exported',
}
