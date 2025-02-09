import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductOptionDto } from './product-option.dto';
import { ProductInventoryDto } from './product-inventory.dto';
import { ProductAttributeDto } from './product-attribute.dto';

export class ProductVariantDto {
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

  @IsBoolean()
  public onSales: boolean;

  @IsNumber()
  public price: number;

  @IsNumber()
  @IsOptional()
  public salePrice: number;

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

  /** @deprecated */
  @IsOptional()
  @IsArray()
  @ValidateNested()
  public options?: ProductOptionDto[];

  @IsOptional()
  @Type(() => ProductAttributeDto)
  @ValidateNested({ each: true })
  public attributes?: ProductAttributeDto[];
}
