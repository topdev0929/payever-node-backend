
export enum MessageBusEventsEnum {
  ProductCreated = 'third-party.event.product.created',
  ProductUpserted = 'third-party.event.product.upserted',
  ProductUpdated = 'third-party.event.product.updated',
  ProductRemoved = 'third-party.event.product.removed',
  StockCreated = 'third-party.event.stock.created',
  StockAdded = 'third-party.event.stock.added',
  StockSubtracted = 'third-party.event.stock.subtracted',
  StockEventTrigger = 'synchronizer.event.inventory.trigger',
}
