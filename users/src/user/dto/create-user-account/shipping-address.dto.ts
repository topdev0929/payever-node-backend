import { ApiProperty } from '@nestjs/swagger';
import { IsCountryCode } from '@pe/common-sdk';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ShippingAddressInterface } from 'src/user/interfaces/shipping-address.interface';

export class ShippingAddressDto implements ShippingAddressInterface {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsCountryCode()
  public country: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public street: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public apartment: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public zipCode: string;
}
