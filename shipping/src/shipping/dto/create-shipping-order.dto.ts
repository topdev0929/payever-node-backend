import {
  ShippingMethodInterface,
  ShippingBoxInterface,
  AddressInterface,
  ShippingProductItemInterface,
  ShippingOriginInterface,
} from '../interfaces';
import { BusinessInterface } from '../../business/interfaces';

export class CreateShippingOrderDto {
  public business: BusinessInterface;
  public businessId?: string;
  public shippingOrigin: ShippingOriginInterface;
  public shippingMethod: ShippingMethodInterface;
  public shippingItems: ShippingProductItemInterface[];
  public shippingBoxes: ShippingBoxInterface[];
  public shippingAddress: AddressInterface;
  public billingAddress?: AddressInterface;
}
