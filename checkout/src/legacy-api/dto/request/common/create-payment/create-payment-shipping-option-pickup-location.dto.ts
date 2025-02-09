import { CreatePaymentAddressDto } from './create-payment-address.dto';

export class CreatePaymentShippingOptionPickupLocationDto {
  public id?: string;
  public name?: string;
  public address?: CreatePaymentAddressDto;
}
