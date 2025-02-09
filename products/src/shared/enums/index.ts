export enum MessageBusChannelsEnum {
  products = 'async_events_products_micro',
  productsRpc = 'async_events_products_rpc',
  productsFolders = 'async_events_products_folders_micro',
  productInward = 'async_events_products_inward_micro',
}

export enum RabbitExchangesEnum {
  asyncEvents = 'async_events',
  rpcCalls = 'rpc_calls',
  productsFolders = 'products_folders',
  bulkProduct = 'products_bulk'
}

export enum MessageBusRoutingKeys {
  ProductRoutingKeyInward = '1',
}
