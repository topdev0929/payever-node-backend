import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsOptional, IsString, ValidateNested, ValidateIf, IsDateString, NotEquals, IsNotEmpty } from 'class-validator';

import { IsLanguage } from '@pe/common-sdk';
import { IsGreaterThan, IsLesserThan } from '../../decorators';
import { UserAccountInterface } from '../../interfaces';
import { ShippingAddressDto } from './shipping-address.dto';
import { DateHelper } from '../../utils';

export class UserAccountDto implements Omit<UserAccountInterface, 'birthday'> {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsLanguage()
  public language?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public salutation?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public lastName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Transform((email: string) => email?.toLowerCase())
  public email?: string;

  public minDate: Date = DateHelper.hundredYearsAgo();
  public maxDate: Date = new Date();

  @ApiProperty({ required: false })
  @ValidateIf((o: UserAccountDto) => o.birthday !== undefined)
  @NotEquals(null)
  @IsDateString()
  @IsGreaterThan('minDate', { message: 'Age must be less than 100 years' })
  @IsLesserThan('maxDate', { message: 'Age must be greater than 0 years' })
  public birthday?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public logo?: string;

  @ApiProperty({ required: false })
  @ValidateNested()
  @IsOptional()
  @Type(() => ShippingAddressDto)
  public shippingAddresses?: ShippingAddressDto[];
}
