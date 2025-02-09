export enum MessageBusExchangesEnum {
  asyncEvents = 'async_events',
  checkoutAnalytics = 'checkout_analytics',
}

export enum MessageBusChannelsEnum {
  asyncEventsCheckoutAnalytics = 'async_events_checkout_analytics_app_micro',
}

export enum MessageBusEventsEnum {
  // async_events
  SendMail = 'payever.event.mailer.send',
  CustomMetricsAdded = 'checkout-analytics.custom-metrics.added',

  PaymentCreated = 'checkout.event.payment.created',
  PaymentSubmitted = 'checkout.event.payment.submitted',
  PaymentUpdated = 'checkout.event.payment.updated',
  PaymentRemoved = 'checkout.event.payment.removed',

  PaymentFlowCreated = 'checkout.event.payment-flow.created',
  PaymentFlowUpdated = 'checkout.event.payment-flow.updated',

  PaymentBlankMigrate = 'checkout.event.payment.blank-migrate',
  PaymentMigrate = 'checkout.event.payment.migrate',
  TransactionsMigrate = 'transactions.event.payment.migrate',
  TransactionsPaymentExport = 'transactions.event.payment.export',
  ErrorNotificationLastTransactionTime = 'error-notifications.event.last-transaction-time',

  ApiCallCreated = 'checkout.event.api-call.created',
  ApiCallUpdated = 'checkout.event.api-call.updated',
  ApiCallMigrate = 'checkout.event.api-call.migrate',

  ActionApiCallCreated = 'checkout.event.action-api-call.created',
  ActionApiCallMigrate = 'checkout.event.action-api-call.migrate',

  OAuthAccessTokenIssued = 'auth.event.oauth-token.issued',
}
