export enum RabbitChannelsEnum {
  Shipping = 'async_events_shipping_app_micro',
  ShippingFolders = 'async_events_shipping_folders_micro',
  ShippingFoldersExport = 'async_events_shipping_folders_export_micro',
}

export enum RabbitExchangesEnum {
  asyncEvents = 'async_events',
  shippingFolders = 'shipping_folders',
  shippingFoldersExport = 'shipping_folders_export',
}

export enum RabbitEventNameEnum {
  AppInstalled = 'connect.event.third-party.enabled',
  AppUninstalled = 'connect.event.third-party.disabled',

  BusinessCreated = 'users.event.business.created',
  BusinessUpdated = 'users.event.business.updated',
  BusinessRemoved = 'users.event.business.removed',

  ThirdPartyConnected = 'third-party.event.third-party.connected',
  ThirdPartyDisconnected = 'third-party.event.third-party.disconnected',

  AppRegistryInstalled = 'app-registry.event.application.installed',
  AppRegistryUninstalled = 'app-registry.event.application.uninstalled',

  ChannelSetCreated = 'channels.event.channel-set.created',
  ChannelSetDeleted = 'channels.event.channel-set.deleted',

  MonolithBusinessMigrate = 'monolith.business.migrate',

  UsersEventBusinessExport = 'users.event.business.export',
  UsersEventBusinessUpdated = 'users.event.business.updated',

  CheckoutEventChannelSetByBusinessExport = 'checkout.event.channel-set-by-business.export',

  ShippingOrderProcessed = 'shipping.event.shipping-order.processed',
  ShippingOrderCreated = 'shipping.event.shipping-order.created',
  ShippingOrderRemoved = 'shipping.event.shipping-order.removed',
  ShippingOrderUpdated = 'shipping.event.shipping-order.updated',
  ShippingOrderExported = 'shipping.event.shipping-order.export',

  ShippingSettingCreated = 'shipping.event.shipping-settings.created',
  ShippingSettingUpdated = 'shipping.event.shipping-settings.updated',
  ShippingSettingRemoved = 'shipping.event.shipping-settings.removed',
  ShippingSettingExported = 'shipping.event.shipping-settings.export',

  ShippingZoneCreated = 'shipping.event.shipping-zones.created',
  ShippingZoneUpdated = 'shipping.event.shipping-zones.updated',
  ShippingZoneRemoved = 'shipping.event.shipping-zones.removed',
  ShippingZoneExported = 'shipping.event.shipping-zones.export',

  ShippingLabelDownloaded = 'shipping.event.shipping-label.downloaded',
  ShippingSlipDownloaded = 'shipping.event.shipping-slip.downloaded',
}
