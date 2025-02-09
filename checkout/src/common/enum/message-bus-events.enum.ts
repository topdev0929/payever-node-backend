export enum MessageBusEventsEnum {
  apiCallCreated = 'checkout.event.api-call.created',
  apiCallUpdated = 'checkout.event.api-call.updated',
  apiCallMigrate = 'checkout.event.api-call.migrate',

  CheckoutCreated = 'checkout.event.checkout.created',
  CheckoutUpdated = 'checkout.event.checkout.updated',
  CheckoutRemoved = 'checkout.event.checkout.deleted',
  CheckoutExport = 'checkout.event.checkout.export',
  CheckoutChannelSetExport = 'checkout.event.checkout-channel-set.export',

  CheckoutIntegrationEnabled = 'checkout.event.integration.enabled',
  CheckoutIntegrationDisabled = 'checkout.event.integration.disabled',

  flowCreated = 'checkout.event.payment-flow.created',
  flowUpdated = 'checkout.event.payment-flow.updated',

  scheduledTaskExecute = 'checkout.event.scheduled-task.execute',
  scheduledPaymentActionRun = 'checkout.event.scheduled-payment-action.run',
}
