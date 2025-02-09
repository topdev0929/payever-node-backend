import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

import { PaymentOptionDto } from '../payment-option.dto';
import { AddressDto } from './address.dto';
import { BusinessDto } from './business.dto';

export class PaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public uuid: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public amount: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public total: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessDto)
  public business: BusinessDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public currency: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public reference: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public customer_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public customer_email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public specific_status: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public status: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => AddressDto)
  public address: AddressDto;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public fee: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public delivery_fee: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public down_payment: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public place: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  public created_at: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public vat_rate: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public payment_option: PaymentOptionDto;
}
