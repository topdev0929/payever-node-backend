import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductVariantDto } from './product-variant.dto';
import { ProductInventoryDto } from './product-inventory.dto';
import { ProductShippingDto } from './product-shipping.dto';
import { ProductAttributeDto } from './product-attribute.dto';
import { VariantAttributeDto } from './variant-attribute.dto';
import { ProductConditionEnum } from '../../enums';

export class ProductDto {
  @IsOptional()
  @IsString()
  public id?: string;

  @IsArray()
  public images: string[];

  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsBoolean()
  public onSales: boolean;

  @IsString()
  public origin: string;

  @IsString()
  @IsOptional()
  public currency?: string;

  @IsNumber()
  public price: number;

  @IsNumber()
  @IsOptional()
  public salePrice?: number;

  @IsString()
  @IsNotEmpty()
  public sku: string;

  @IsString()
  @IsOptional()
  public barcode?: string;

  @IsString()
  @IsOptional()
  public brand?: string;

  @IsArray()
  public categories: string[];

  @IsString()
  @IsOptional()
  public condition?: ProductConditionEnum;

  @IsString()
  @IsArray()
  public channelSets?: string[];

  @IsString()
  @IsOptional()
  public type: string;

  @IsBoolean()
  public active: boolean;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ProductVariantDto)
  public variants?: ProductVariantDto[];

  @IsString()
  @IsOptional()
  public country?: string;

  @IsNumber()
  @IsOptional()
  public vatRate?: number;

  @IsOptional()
  @Type(() => ProductInventoryDto)
  @ValidateNested()
  public inventory?: ProductInventoryDto;

  @IsOptional()
  @Type(() => ProductShippingDto)
  @ValidateNested()
  public shipping?: ProductShippingDto;

  @IsOptional()
  @Type(() => ProductAttributeDto)
  @ValidateNested({ each: true })
  public attributes?: ProductAttributeDto[];

  @IsOptional()
  @Type(() => VariantAttributeDto)
  @ValidateNested({ each: true })
  public variantAttributes?: VariantAttributeDto[];
}
