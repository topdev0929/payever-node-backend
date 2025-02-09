export enum MessageBusChannelsEnum {
  errorNotifications = 'async_events_error_notifications_micro',
}

export enum MessageBusExchangesEnum {
  asyncEvents = 'async_events',
}

export enum MessageBusEventsEnum {
  businessEmail = 'payever.event.business.email',

  paymentNotificationFailed = 'error-notifications.event.payment-notification.failed',
  pspApiFailed = 'error-notifications.event.psp-api.failed',
  paymentOptionCredentialsInvalid = 'error-notifications.event.payment-option-credentials.invalid',
  apiKeysInvalid = 'error-notifications.api-keys.invalid',
  thirdPartyError = 'error-notifications.event.third-party-error',

  CheckoutConnectionUninstalled = 'checkout.event.connection.uninstalled',
  ConnectThirdPartyDisabled = 'connect.event.third-party.disabled',

  PaymentSubmitted = 'checkout.event.payment.submitted',
  PaymentUpdated = 'checkout.event.payment.updated',
  PaymentRemoved = 'checkout.event.payment.removed',
}
