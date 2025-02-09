import { CreatePaymentShippingOptionPickupLocationDto } from './create-payment-shipping-option-pickup-location.dto';

export class CreatePaymentShippingOptionDetailsDto {
  public timeslot?: Date;
  public pickup_location?: CreatePaymentShippingOptionPickupLocationDto;
}
