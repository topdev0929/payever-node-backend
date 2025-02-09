import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProductOptionDto } from './product-option.dto';

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
  @IsArray()
  @ValidateNested()
  @Type(() => ProductOptionDto)
  public options?: ProductOptionDto[];
}
