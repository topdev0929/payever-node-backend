import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsBooleanString, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class ChangedBpoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  public accept_fee: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBooleanString()
  @Transform(( value: string ) => value === '1')
  public default: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public uuid: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public business_uuid: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public payment_method: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  public completed: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public status: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public shipping_address_allowed: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public shipping_address_equality: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Expose({ name: 'vendor_min_amount'})
  public min?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Expose({ name: 'vendor_max_amount'})
  public max?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Expose({ name: 'position'})
  public sortOrder?: number;
}
