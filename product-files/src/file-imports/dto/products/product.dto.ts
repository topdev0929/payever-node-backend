import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ProductVariantsDto } from './product-variants.dto';
import { ProductShippingDto } from './product-shipping.dto';
import { ProductInventoryDto } from './product-inventory.dto';
import { ProductAttributeDto } from './product-attribute.dto';
import { VariantAttributeDto } from './variant-attribute.dto';
import { ProductSaleDto } from '../product-sale.dto';

export enum ProductTypeEnum {
  physical = 'physical',
  digital = 'digital',
  service = 'service',
}

export class ProductDto {
  @IsOptional()
  @IsString()
  public currency?: string;

  @IsArray()
  public images: string[];

  @IsOptional()
  @IsArray()
  public imagesUrl?: string[];

  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsNumber()
  @IsNotEmpty()
  public price: number;

  @IsOptional()
  @Type(() => ProductSaleDto)
  public sale?: ProductSaleDto;

  @IsString()
  @IsNotEmpty()
  public sku: string;

  @IsString()
  @IsOptional()
  public barcode: string;

  @IsArray()
  @IsOptional()
  public categories: string[];

  @IsOptional()
  public channelSets?: string[];

  @IsEnum(ProductTypeEnum)
  @IsNotEmpty()
  public type: ProductTypeEnum;

  @IsOptional()
  @IsString()
  public uuid?: string;

  @IsBoolean()
  public active: boolean;

  @IsArray()
  @Type(() => ProductVariantsDto)
  @IsOptional()
  @ValidateNested({ each: true })
  public variants?: ProductVariantsDto[];

  @ValidateIf((o: any) => o.type === 'physical' )
  @IsNotEmpty()
  @Type(() => ProductShippingDto)
  @ValidateNested()
  public shipping?: ProductShippingDto;

  @IsOptional()
  @Type(() => ProductInventoryDto)
  @ValidateNested()
  public inventory?: ProductInventoryDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  public attributes?: ProductAttributeDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VariantAttributeDto)
  public variantAttributes?: VariantAttributeDto[];
}
