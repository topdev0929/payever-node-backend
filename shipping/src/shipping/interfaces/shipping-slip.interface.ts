import { ShippingOriginInterface } from './shipping-origin.interface';
import { AddressInterface } from './address.interface';
import { ShippingProductItemInterface } from './shipping-product-item.interface';

export interface ShippingSlipInterface {
  from: ShippingOriginInterface;
  to: AddressInterface;
  billingAddress: AddressInterface;
  products: ShippingProductItemInterface[];
  businessName: string;
  legalText: string;
}
