import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductInventoryDto } from './product-inventory.dto';
import { ProductAttributeDto } from './product-attribute.dto';
import { VariantOptionDto } from './variant-option.dto';
import { ProductSaleDto } from '../product-sale.dto';

export class ProductVariantsDto {
  @IsOptional()
  @IsArray()
  public images?: string[];

  @IsOptional()
  @IsArray()
  public imagesUrl?: string[];

  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsNumber()
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

  @IsOptional()
  @Type(() => ProductInventoryDto)
  @ValidateNested()
  public inventory?: ProductInventoryDto;

  @IsOptional()
  @IsArray()
  @Type(() => VariantOptionDto)
  @ValidateNested({ each: true })
  public options?: VariantOptionDto[];

  @IsOptional()
  @IsArray()
  @Type(() => ProductAttributeDto)
  @ValidateNested({ each: true })
  public attributes?: ProductAttributeDto[];
}
