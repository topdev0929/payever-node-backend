import { CreatedByEnum } from '../enums';
import { ShippingRateInterface } from './shipping-rate.interface';

export interface ShippingZoneInterface {
  name?: string;
  countryCodes?: string[];
  deliveryTimeDays?: number;
  rates?: ShippingRateInterface[];
  createdBy?: CreatedByEnum;
}
