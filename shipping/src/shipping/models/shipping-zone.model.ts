import { ShippingZoneInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface ShippingZoneModel extends ShippingZoneInterface, Document {
  id: any;
}
