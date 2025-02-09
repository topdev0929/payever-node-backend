import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePaymentAddressDto } from './create-payment-address.dto';

@Exclude()
export class CreatePaymentShippingOptionDetailsPickupLocationDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Expose()
  public id?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Expose()
  public name?: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => CreatePaymentAddressDto)
  @ValidateNested()
  @Expose()
  public address?: CreatePaymentAddressDto;
}
