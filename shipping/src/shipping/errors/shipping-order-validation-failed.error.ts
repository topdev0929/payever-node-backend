import { ShippingOrderProcessingError } from './shipping-order-processing.error';

export class ShippingOrderValidationFailedError extends ShippingOrderProcessingError {
  constructor(orderId: string) {
    super(orderId);

    this.message = `Shipping order "${orderId}" is not validated`;
  }
}
