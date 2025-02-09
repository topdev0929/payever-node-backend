import { PickupTimeEnums } from '../enums';
import { ShippingOriginInterface } from '../interfaces';

export interface LocalPickUpInterface {
  shippingOrigin: ShippingOriginInterface | string;
  pickUpTime?: PickupTimeEnums;
  pickUpMessage?: string;
}
