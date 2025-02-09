import { IsDateString, IsOptional, ValidateNested } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  CreatePaymentShippingOptionDetailsPickupLocationDto,
} from './create-payment-shipping-option-details-pickup-location.dto';

@Exclude()
export class CreatePaymentShippingOptionDetailsDto {
  @ApiProperty()
  @IsOptional()
  @IsDateString()
  @Expose()
  public timeslot?: Date;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePaymentShippingOptionDetailsPickupLocationDto)
  @Expose()
  public pickup_location?: CreatePaymentShippingOptionDetailsPickupLocationDto;
}
