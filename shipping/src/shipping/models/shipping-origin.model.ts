import { Document } from 'mongoose';
import { LocalDeliveryInterface, LocalPickUpInterface, ShippingOriginInterface } from '../interfaces';

export interface ShippingOriginModel extends ShippingOriginInterface, Document {
  localDelivery?: LocalDeliveryInterface;
  localPickUp?: LocalPickUpInterface;
}
