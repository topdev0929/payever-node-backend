import { IsNotEmpty, IsNumber, IsEnum, IsString, IsDefined, IsOptional } from 'class-validator';
import { ShippingProductItemInterface } from '../interfaces';
import { WeightUnitEnums, DimensionUnitEnums } from '../enums';

export class ShippingProductItemDto implements ShippingProductItemInterface {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  public uuid: string;

  @IsNotEmpty()
  @IsNumber()
  @IsDefined()
  public quantity: number;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  public name: string;

  @IsOptional()
  @IsString()
  public image?: string;

  @IsOptional()
  @IsString()
  public currency?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsDefined()
  public price: number;

  @IsNotEmpty()
  @IsNumber()
  @IsDefined()
  public weight: number;

  @IsNotEmpty()
  @IsNumber()
  @IsDefined()
  public width: number;

  @IsNotEmpty()
  @IsNumber()
  @IsDefined()
  public length: number;

  @IsNotEmpty()
  @IsNumber()
  @IsDefined()
  public height: number;

  @IsOptional()
  @IsString()
  public sku: string;

  @IsOptional()
  @IsString()
  public thumbnail?: string;

  @IsOptional()
  @IsString()
  public vatRate?: number;

  @IsNotEmpty()
  @IsEnum(WeightUnitEnums)
  @IsDefined()
  public weightUnit: WeightUnitEnums;

  @IsNotEmpty()
  @IsEnum(DimensionUnitEnums)
  @IsDefined()
  public dimensionUnit: DimensionUnitEnums;
}
