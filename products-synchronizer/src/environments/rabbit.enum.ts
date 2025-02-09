export enum MessageBusExchangesEnum {
  asyncEvents = 'async_events',
  product_sync = 'product_sync_trigger',
  bulkProduct = 'products_bulk',
}

export enum RabbitChannelEnum {
  Synchronizer = 'async_events_products_synchronizer_micro',
  SynchronizerInward = 'async_events_products_synchronizer_inward_micro',
  SynchronizerInventory = 'async_events_inventory_synchronizer_micro',
}

export enum MessageBusRoutingKeys {
  ProductSyncRoutingKeyInward = '1',
}
