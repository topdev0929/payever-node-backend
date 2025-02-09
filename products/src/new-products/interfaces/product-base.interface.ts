export interface ProductBaseInterface {
  id: string;
  businessId: string;
  sku: string;

  /** @deprecated */
  _id: string;

  /** @deprecated */
  uuid: string;
}
