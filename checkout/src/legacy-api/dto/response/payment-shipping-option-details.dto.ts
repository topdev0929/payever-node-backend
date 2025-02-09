import { IsOptional } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { PaymentShippingOptionPickupLocationDto } from './payment-shipping-option-pickup-location.dto';

@Exclude()
export class PaymentShippingOptionDetailsDto {

  @IsOptional()
  @Expose()
  public timeslot?: string;

  @IsOptional()
  @Expose()
  @Type(() => PaymentShippingOptionPickupLocationDto)
  public pickup_location?: PaymentShippingOptionPickupLocationDto;
}
