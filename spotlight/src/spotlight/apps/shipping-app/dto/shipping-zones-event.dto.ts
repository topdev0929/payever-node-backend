import { IsNotEmpty, IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class ShippingZoneEventDto {

  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsOptional()
  @IsString()
  public name: string;

  @IsOptional()
  @IsString()
  public businessId: string;

  @IsOptional()
  @IsArray()
  public countryCodes: string[];

  @IsOptional()
  @IsNumber()
  public deliveryTimeDays: number;
}
