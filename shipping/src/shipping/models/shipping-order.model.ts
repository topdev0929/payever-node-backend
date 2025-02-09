import { ShippingOrderInterface } from '../interfaces';
import { Document } from 'mongoose';
import {
  ShippingBoxModel,
  ShippingHistoryModel,
  ShippingMethodModel,
  ShippingOriginModel,
  ShippingProductItemModel,
} from '../models';
import { BusinessModel } from '../../business/models';

export interface ShippingOrderModel extends ShippingOrderInterface, Document {
  business?: BusinessModel;
  shippingItems?: ShippingProductItemModel[];
  shippingBoxes?: ShippingBoxModel[];
  shippingHistory?: ShippingHistoryModel[];
  shippingOrigin: ShippingOriginModel;
  shippingMethod?: ShippingMethodModel;
}
