import { ShippingOriginInterface } from './shipping-origin.interface';
import { ShippingBoxInterface } from './shipping-box.interface';
import { ShippingZoneInterface } from './shipping-zone.interface';
import { BusinessInterface } from '../../business/interfaces';
import { ProductInterface } from './products.interface';
import { CreatedByEnum } from '../enums';

export interface ShippingSettingInterface {
  name: string;
  isDefault?: boolean;
  products: ProductInterface[] | string[];
  business?: BusinessInterface;
  businessId: string;
  origins?: ShippingOriginInterface[] | string[];
  boxes?: ShippingBoxInterface[] | string[];
  zones?: ShippingZoneInterface[] | string[];
  createdBy?: CreatedByEnum;
}
