import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { ShippingRateInterface } from '../interfaces';

export class CreateShippingZoneDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  public countryCodes: string[];

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  public deliveryTimeDays: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  public rates: ShippingRateInterface[];
}
