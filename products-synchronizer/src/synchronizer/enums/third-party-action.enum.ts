/**
 * Actions are defined for each third-party entity inside third-party micro.
 */
export enum ThirdPartyActionEnum {
  CreateProduct = 'create-product',
  UpdateProduct = 'update-product',
  RemoveProduct = 'remove-product',
  AddInventory = 'add-inventory',
  SubtractInventory = 'subtract-inventory',
  SetInventory = 'set-inventory',
  SyncProducts = 'sync-products',
  SyncInventory = 'sync-inventory',
  ImportFile = 'import-file',
  CreateCollection = 'create-collection',
  UpdateCollection = 'update-collection',
  RemoveCollection = 'remove-collection',
  OrderCreated = 'order-created',
}
