import { PaymentMethodAddressRequestInterface } from '../../../../interfaces';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class PaymentMethodsAddressRequestDto implements PaymentMethodAddressRequestInterface{
  @Expose()
  @ApiProperty()
  @IsString()
  public city: string;

  @Expose()
  @ApiProperty()
  @IsString()
  public country: string;

  @Expose()
  @ApiPropertyOptional()
  @IsString()
  public email?: string;

  @Expose({ name: 'first_name'})
  @ApiProperty({ name: 'first_name'})
  @IsString()
  public firstName: string;

  @Expose({ name: 'last_name'})
  @ApiProperty({ name: 'last_name'})
  @IsString()
  public lastName: string;

  @Expose()
  @ApiPropertyOptional()
  @IsString()
  public phone?: string;

  @Expose()
  @ApiPropertyOptional()
  @IsString()
  public salutation?: string;

  @Expose()
  @ApiProperty()
  @IsString()
  public street: string;

  @Expose({ name: 'street_number'})
  @ApiPropertyOptional({ name: 'street_number'})
  @IsString()
  public streetNumber?: string;

  @Expose()
  @ApiProperty()
  @IsString()
  public zip: string;

  @Expose()
  @ApiPropertyOptional()
  @IsString()
  public region?: string;
}
