export class ShippingOrderProcessingError extends Error {
  protected orderId: string;
  constructor(orderId: string) {
    super(`Error while order "${orderId}" processing`);

    this.orderId = orderId;
  }
}
