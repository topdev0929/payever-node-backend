import { PaymentLinkShippingOptionPickupLocationDto } from './payment-link-shipping-option-pickup-location.dto';
import { Expose, Type, Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDate } from 'class-validator';

@Exclude()
export class PaymentLinkShippingOptionDetailsDto {
  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsDate()
  public timeslot?: Date;

  @Expose({ name: 'pickupLocation'})
  @ApiProperty({ required: false, name: 'pickupLocation'})
  @IsOptional()
  @Type( () => PaymentLinkShippingOptionPickupLocationDto)
  public pickup_location?: PaymentLinkShippingOptionPickupLocationDto;
}
