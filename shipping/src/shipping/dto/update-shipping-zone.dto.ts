import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ShippingRateInterface } from '../interfaces';

export class UpdateShippingZoneDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  public countryCodes: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  public deliveryTimeDays: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  public rates: ShippingRateInterface[];
}
