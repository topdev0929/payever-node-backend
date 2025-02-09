export class FlowPaymentOptionVariantResponseDto {
  public id: string;
  public name: string;
  public default: boolean;
  public merchantCoversFee: boolean;
  public shippingAddressAllowed: boolean;
  public shippingAddressEquality: boolean;
  public version: string;
  public min: number;
  public max: number;
}
