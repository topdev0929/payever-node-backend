import { ShippingHistoryInterface } from '../interfaces';
import { ShippingProductItemModel } from '../models';

export interface ShippingHistoryModel extends ShippingHistoryInterface, Document {
  shippedItems: ShippingProductItemModel[];
}
