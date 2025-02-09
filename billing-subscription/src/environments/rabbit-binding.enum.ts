export enum RabbitChannelsEnum {
  BillingSubscription = 'async_events_billing_subscription_micro',
  FolderBillingSubscription = 'async_events_billing_subscription_folders_micro',
  FolderBillingExportSubscription = 'async_events_billing_subscription_folders_export_micro',
}

export enum RabbitExchangeFallbackEnum {
  AsyncFallback = 'async_events_fallback',
  FolderFallback = 'billing_subscription_folders_fallback',
  FolderExportFallback = 'billing_subscription_folders_export_fallback',
}

export enum RabbitExchangeEnum {
  AsyncEvents = 'async_events',
  FolderEvents = 'billing_subscription_folders',
  FolderEventsExport = 'billing_subscription_folders_export',
}

export enum RabbitBinding {
  Login = 'auth.event.access_token_issued',
  ProductExported = 'products.event.product.exported',
  ProductUpdated = 'products.event.product.updated',
  ProductRemoved = 'products.event.product.removed',
  ThirdPartyIntegrationConnected = 'third-party.event.third-party.connected',
  ThirdPartyIntegrationDisconnected = 'third-party.event.third-party.disconnected',
  ThirdPartyIntegrationConnectionExported = 'third-party.event.connection.exported',
  BusinessCreated = 'users.event.business.created',
  BusinessUpdated = 'users.event.business.updated',
  BusinessExport = 'users.event.business.export',
  BusinessRemoved = 'users.event.business.removed',
  PaymentCreated = 'checkout.event.payment.created',
  SubscriptionEvent = 'third-party.event.subscription',
  ConnectThirdPartyUninstalled = 'connect.event.third-party.disabled',
}
