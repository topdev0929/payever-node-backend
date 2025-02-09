import { Document } from 'mongoose';
import { LocalPickUpInterface } from '../interfaces';
import { ShippingOriginModel } from '../models';

export interface LocalPickUpModel extends LocalPickUpInterface, Document {
  shippingOrigin: ShippingOriginModel;
}
