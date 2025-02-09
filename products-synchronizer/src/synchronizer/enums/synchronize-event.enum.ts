export enum SynchronizeEventEnum {
  InwardSyncStarted = 'synchronizer.event.inner-sync.started',
  PRODUCTS = 'synchronizer.event.products.synchronize',
  INVENTORY = 'synchronizer.event.inventory.synchronize',
  INVENTORY_TRIGGER = 'synchronizer.event.inventory.trigger',
  BULK_PRODUCT = 'synchronizer.event.outer-products.upserted',
  BULK_PRODUCT_STATIC = 'synchronizer.event.outer-products.upserted.static',
}
