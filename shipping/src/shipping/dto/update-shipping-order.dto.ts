import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { ShippingStatusEnums } from '../enums';

export class UpdateShippingOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public trackingId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public shipmentNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  public shippingAddress: AddressDto;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public label?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public trackingUrl?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(ShippingStatusEnums)
  public status?: string;
}
