export enum MessageBusChannelsEnum {
  checkout = 'async_events_checkout_app_micro',
  checkoutFolders = 'async_events_checkout_folders_micro',
  checkoutFoldersExport = 'async_events_checkout_folders_export_micro',
}

export enum RabbitExchangesEnum {
  asyncEvents = 'async_events',
  checkoutFolders = 'checkout_folders',
  checkoutFoldersExport = 'checkout_folders_export',
}

export enum RabbitBinding {
  IntegrationInstalled = 'connect.event.third-party.enabled',
  IntegrationUninstalled = 'connect.event.third-party.disabled',

  ChannelSetUnlinked = 'checkout.event.channel-set.unlinked',

  CheckoutLinkedToChannelSet = 'checkout.event.checkout.channel-set-linked',

  CheckoutConnectionInstalled = 'checkout.event.connection.installed',
  CheckoutConnectionUninstalled = 'checkout.event.connection.uninstalled',

  ChannelSetCreated = 'channels.event.channel-set.created',
  ChannelSetUpdated = 'channels.event.channel-set.updated',
  ChannelSetDeleted = 'channels.event.channel-set.deleted',
  ChannelSetExported = 'channels.event.channel-set.exported',
  ChannelSetForCheckoutCreated = 'channels.event.channel-set.created-by-default',
  ChannelSetNamed = 'channels.event.channel-set.named',
  ChannelSetActivated = 'channels.event.channel-set.activated',

  BusinessCreated = 'users.event.business.created',
  BusinessRemoved = 'users.event.business.removed',
  BusinessUpdated = 'users.event.business.updated',
  BusinessExport = 'users.event.business.export',

  LegacyBusinessMigrate = 'checkout.event.business.migrate',
  LegacyChannelSetMigrate = 'checkout.event.channel-set.migrate',

  ThirdPartyConnected = 'third-party.event.third-party.connected',
  ThirdPartyDisconnected = 'third-party.event.third-party.disconnected',

  ApplicationInstalled = 'app-registry.event.application.installed',
  ApplicationUninstalled = 'app-registry.event.application.uninstalled',

  MailReportDataRequested = 'mailer-report.event.report-data.requested',

  CheckoutPrepared = 'checkout.event.report-data.prepared',

  PaymentMigrate = 'checkout.event.payment.migrate',
  PaymentCreated = 'checkout.event.payment.created',
  PaymentUpdated = 'checkout.event.payment.updated',
  PaymentRemoved = 'checkout.event.payment.removed',
  PaymentSubmmited = 'checkout.event.payment.submitted',

  PaymentFlowMigrate = 'checkout.event.payment-flow.migrate',

  BPOCreated = 'checkout.event.business-payment-option.created',
  BPOUpdated = 'checkout.event.business-payment-option.updated',
  BPORemoved = 'checkout.event.business-payment-option.removed',
  BPOMigrate = 'checkout.event.business-payment-option.migrate',

  ChannelSetByBusinessExport = 'checkout.event.channel-set-by-business.export',

  PayeverEventUserEmail = 'payever.event.user.email',

  TransactionsOrderCreated = 'transactions.event.order.created',
}
