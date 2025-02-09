import { PaymentLinkAddressDto } from './payment-link-address.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

@Exclude()
export class PaymentLinkShippingOptionPickupLocationDto {
  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public id?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public name?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @Type( () => PaymentLinkAddressDto)
  public address?: PaymentLinkAddressDto;
}
