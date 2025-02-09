import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class ShippingProfileEventDto {
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
  public zones: any[];
}
