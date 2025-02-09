import { ShippingOriginInterface } from '../interfaces';

export interface LocalDeliveryInterface {
  shippingOrigin: ShippingOriginInterface | string;
  deliveryRadius: number;
  postalCodes: string[];
  minOrderPrice: number;
  deliveryPrice: number;
  deliveryMessage: string;
}
