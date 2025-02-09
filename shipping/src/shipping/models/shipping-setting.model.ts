import { Document } from 'mongoose';

import { ShippingSettingInterface } from '../interfaces';
import { BusinessModel } from '../../business/models';
import { ShippingZoneModel } from './shipping-zone.model';
import { ShippingBoxModel } from './shipping-box.model';
import { ShippingOriginModel } from './shipping-origin.model';
import { ProductModel } from './product.model';

export interface ShippingSettingModel extends ShippingSettingInterface, Document {
  business?: BusinessModel;
  businessId: string;
  products: ProductModel[] | string[];
  boxes?: ShippingBoxModel[] | string[];
  zones?: ShippingZoneModel[] | string[];
  origins?: ShippingOriginModel[] | string[];
}
