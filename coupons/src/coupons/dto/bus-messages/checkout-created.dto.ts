// tslint:disable: max-line-length

/**
 * @see https://gitlab.devpayever.com/nodejs-backend/checkout/blob/1e658cac1d3ed663097813958cd532807f8cb081/src/checkout/rabbit-producers/checkout-rabbit.producer.ts#L21
 */
export interface CheckoutCreatedDto {
    businessId: string;
    checkoutId: string;
}
