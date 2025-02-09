export enum RabbitChannelsEnum {
  BillingSubscription = 'async_events_billing_affiliate_micro',
}

export enum RabbitBinding {
  ProductUpdated = 'products.event.product.updated',
  ProductRemoved = 'products.event.product.removed',
}
