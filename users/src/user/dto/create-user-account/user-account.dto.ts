import { ApiProperty } from '@nestjs/swagger';
import { IsLanguage } from '@pe/common-sdk';
import { Type, Transform } from 'class-transformer';
import { IsOptional, IsString, ValidateNested, IsDate, IsNotEmpty } from 'class-validator';
import { UserAccountInterface } from '../../interfaces';
import { ShippingAddressDto } from './shipping-address.dto';

export class UserAccountDto implements Omit<UserAccountInterface, 'birthday'> {

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsLanguage()
  public language?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public salutation?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  public firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  public lastName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public phone?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform((email: string) => email?.toLowerCase())
  public email?: string;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  public birthday?: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public logo?: string;

  @ApiProperty()
  @ValidateNested()
  @IsOptional()
  public shippingAddresses?: ShippingAddressDto[];
}
