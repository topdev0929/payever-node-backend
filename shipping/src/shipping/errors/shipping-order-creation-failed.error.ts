import { ShippingOrderProcessingError } from './shipping-order-processing.error';

export class ShippingOrderCreationFailedError extends ShippingOrderProcessingError {
  constructor(orderId: string) {
    super(orderId);

    this.message = `Shipping order "${orderId}" was not created`;
  }
}
