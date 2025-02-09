import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePaymentShippingOptionPickupLocationDto } from './create-payment-shipping-option-pickup-location.dto';

export class CreatePaymentShippingOptionDetailsDto {
  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public timeslot?: Date;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @Type(() => CreatePaymentShippingOptionPickupLocationDto)
  @ValidateNested({ groups: ['create', 'submit', 'link']})
  public pickup_location?: CreatePaymentShippingOptionPickupLocationDto;
}
