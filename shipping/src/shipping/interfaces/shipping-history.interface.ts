import { ShippingStatusEnums } from '../enums';
import { ShippingProductItemInterface } from '../interfaces';

export interface ShippingHistoryInterface {
  shippedItems: ShippingProductItemInterface[];
  status: ShippingStatusEnums;
}
