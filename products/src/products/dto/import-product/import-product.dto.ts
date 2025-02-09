import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductTypeEnum, ProductConditionEnum } from '../../enums';
import { ImportVariantDto } from './import-variant.dto';
import { ShippingDimensionsDto } from './shipping-dimensions.dto';
import { OptionDto, ProductAttributeDto, ProductSaleDto } from '../';

export class ImportProductDto {
  @IsArray()
  public images: string[];

  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsOptional()
  @IsString()
  public brand?: string;

  @IsOptional()
  @IsEnum(ProductConditionEnum)
  public condition?: ProductConditionEnum = ProductConditionEnum.new;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  @IsOptional()
  public options?: OptionDto[];

  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  @IsOptional()
  public attributes?: ProductAttributeDto[];

  @IsString()
  @IsOptional()
  public currency?: string;

  @IsNumber()
  @IsNotEmpty()
  public price: number;

  @IsOptional()
  @Type(() => ProductSaleDto)
  public sale?: ProductSaleDto;

  /** @deprecated */
  @IsBoolean()
  @IsOptional()
  public onSales?: boolean;

  /** @deprecated */
  @IsNumber()
  @IsOptional()
  public salePrice?: number;

  @IsString()
  @IsNotEmpty()
  public sku: string;

  @IsString()
  @IsOptional()
  public barcode?: string;

  @IsArray()
  public categories: string[];

  @IsArray()
  @IsOptional()
  public channelSets?: string[];

  @IsString()
  @IsOptional()
  public category?: string;

  @IsString()
  @IsOptional()
  public subcategory?: string;

  @IsString({ each: true})
  @IsOptional()
  public subcategories?: string[];

  @IsString()
  @IsOptional()
  public type?: ProductTypeEnum;

  @IsBoolean()
  @IsNotEmpty()
  public active: boolean;

  @IsString()
  @IsNotEmpty()
  public origin: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ImportVariantDto)
  public variants?: ImportVariantDto[];

  @IsString()
  @IsOptional()
  public country?: string;

  @IsString()
  @IsOptional()
  public language?: string;

  @IsNumber()
  @IsOptional()
  public vatRate?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ShippingDimensionsDto)
  public shipping?: ShippingDimensionsDto;
}
