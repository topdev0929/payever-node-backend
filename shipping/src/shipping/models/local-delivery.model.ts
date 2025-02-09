import { Document } from 'mongoose';
import { LocalDeliveryInterface } from '../interfaces';
import { ShippingOriginModel } from '../models';

export interface LocalDeliveryModel extends LocalDeliveryInterface, Document {
  shippingOrigin: ShippingOriginModel;
}
