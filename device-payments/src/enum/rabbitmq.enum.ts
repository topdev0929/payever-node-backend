export enum MessageBusChannelsEnum {
  devicePayments = 'async_events_device_payments_micro',
}

export enum RabbitMessagesEnum {
  UsersBusinessCreated = 'users.event.business.created',
  UsersBusinessRemoved = 'users.event.business.removed',
  CheckoutChannelSetLinked = 'checkout.event.checkout.channel-set-linked',
  CheckoutCreated = 'checkout.event.checkout.created',
  CheckoutUpdated = 'checkout.event.checkout.updated',
  CheckoutPaymentCreated = 'checkout.event.payment.created',
  CheckoutPaymentUpdated = 'checkout.event.payment.updated',
  ConnectThirdPartyEnabled = 'connect.event.third-party.enabled',
  ConnectThirdPartyDisabled = 'connect.event.third-party.disabled',
  OnboardingSetupDevicePayments = 'onboarding.event.setup.device-payments',

  // PoS
  PosTerminalSetDefault = 'pos.event.terminal.set_default',
  PosTerminalCreated = 'pos.event.terminal.created',
  PosTerminalUpdated = 'pos.event.terminal.updated',
  PosTerminalRemoved = 'pos.event.terminal.removed',
  PosTerminalExport = 'pos.event.terminal.export',

  // shop
  shopCreated = 'shops.event.shop.created',
  shopUpdated = 'shops.event.shop.updated',
  shopRemoved = 'shops.event.shop.removed',
  shopExport = 'shops.event.shop.export',
  shopEventShopLiveToggled = 'shops.event.shop.live-toggled',
}
