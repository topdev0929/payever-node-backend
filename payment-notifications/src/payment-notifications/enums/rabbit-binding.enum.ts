export enum MessageBusChannelsEnum {
  paymentNotifications = 'async_events_payment_notifications_micro',
  paymentNotificationsSend = 'payment_notifications',
}

export enum MessageBusExchangesEnum {
  asyncEvents = 'async_events',
  paymentNotificationsSend = 'payment_notifications_send',
}

export enum MessageBusEventsEnum {
  apiCallCreated = 'checkout.event.api-call.created',
  apiCallMigrate = 'checkout.event.api-call.migrate',

  paymentCreated = 'checkout.event.payment.created',
  paymentUpdated = 'checkout.event.payment.updated',

  forceCreateNotification = 'integration.event.payment.create-notification',

  transactionsMigrate = 'transactions.event.payment.migrate',

  paymentNotificationFailed = 'error-notifications.event.payment-notification.failed',
}

export enum MessageBusRoutingKeys {
  paymentNotificationsRoutingKey1 = '1',
}
