import { ApiCallShippingOptionPickupLocationInterface } from './api-call-shipping-option-pickup-location.interface';

export interface ApiCallShippingOptionDetailsInterface {
  timeslot?: Date;
  pickup_location?: ApiCallShippingOptionPickupLocationInterface;
}
