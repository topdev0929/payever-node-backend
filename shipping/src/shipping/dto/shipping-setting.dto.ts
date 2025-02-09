import {
  ShippingOriginInterface,
  ShippingBoxInterface,
  ShippingZoneInterface,
} from '../interfaces';
import { BusinessInterface } from '../../business/interfaces';
import { ProductDto } from './product.dto';

export class ShippingSettingDto {
  public name: string;
  public isDefault: boolean;
  public products: ProductDto[];
  public business: BusinessInterface | string;
  public origins: ShippingOriginInterface[];
  public boxes: ShippingBoxInterface[];
  public zones: ShippingZoneInterface[];
}
