export enum RabbitEventNameEnum {
  BillingSubscriptionsPlanSubscribe = 'subscriptions.event.plan.subscribe',

  ChannelSetCreated = 'channels.event.channel-set.created',
  ChannelSetDeleted = 'channels.event.channel-set.deleted',

  ChannelSetNamed = 'channels.event.channel-set.named',
  ChannelSetExported = 'channels.event.channel-set.exported',
  ChannelSetActivated = 'channels.event.channel-set.activated',

  ThirdPartyInstalled = 'connect.event.third-party.enabled',
  ThirdPartyUninstalled = 'connect.event.third-party.disabled',
  ThirdPartyConnected = 'third-party.event.third-party.connected',
  ThirdPartyDisconnected = 'third-party.event.third-party.disconnected',
  ThirdPartyExported = 'third-party.event.third-party.exported',
  ThirdPartyExportedFromConnect = 'connect.event.third-party.exported',

  ProductSynchronizationSucceeded = 'products.event.product-synchronization.succeeded',
  ProductSynchronizationFailed = 'products.event.product-synchronization.failed',
  ProductsEventProductRequestExport = 'products.event.product.request.export',

  MediaBlobUploaded = 'media.event.media.uploaded',
}
