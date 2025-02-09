export enum MessageBusChannelsEnum {
  inventory = 'async_events_inventory_micro',
}

export const enum RabbitEventsEnum {
  SkuUpdated = 'products.event.product.sku-updated',
  SkuRemoved = 'products.event.product.sku-removed',

  InventorySynchronizationSucceeded = 'inventory.event.inventory-synchronization.succeeded',
  InventorySynchronizationFailed = 'inventory.event.inventory-synchronization.failed',
}
