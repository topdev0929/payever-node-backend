import { CreatedByEnum } from '../enums';
import { LocalDeliveryInterface, LocalPickUpInterface } from '../interfaces';

export interface ShippingOriginInterface {
  name?: string;
  isDefault: boolean;
  streetName: string;
  streetNumber?: string;
  city: string;
  stateProvinceCode?: string;
  zipCode: string;
  countryCode: string;
  phone?: string;
  localDelivery?: LocalDeliveryInterface;
  localPickUp?: LocalPickUpInterface;
  createdBy?: CreatedByEnum;
}
