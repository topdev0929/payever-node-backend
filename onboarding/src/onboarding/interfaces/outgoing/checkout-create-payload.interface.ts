/**
 * @see checkout/src/checkout/dto/create-checkout.dto.ts
 */
export interface CheckoutCreatePayloadInterface {
  default: boolean;
  logo?: string;
  name: string;
  settings?: CheckoutSettingsPayloadInterface;
}

export interface CheckoutSettingsPayloadInterface {
  styles: {
    _id: string;
    active: boolean;
  };
}
