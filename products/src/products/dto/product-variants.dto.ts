import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductAttributeDto } from './product-attribute.dto';
import { ImportVariantDto } from './import-product';
import { OptionDto } from './option.dto';
import { ProductPriceDto } from './product-price.dto';
import { ProductSaleDto } from './product-sale.dto';

export interface ProductVariantOptionsDto {
  _id?: string;
  type: string;
  value: string;
}

// tslint:disable-next-line: max-classes-per-file
export class ProductVariantsDto {
  @IsOptional()
  @IsString()
  public id?: string;

  @IsOptional()
  @IsArray()
  public images?: string[];

  @IsOptional()
  @IsArray()
  public imagesUrl?: string[];

  @IsOptional()
  @IsString()
  public title?: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsNumber()
  public price: number;

  @IsOptional()
  @Type(() => ProductSaleDto)
  public sale?: ProductSaleDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductPriceDto)
  public priceTable?: ProductPriceDto[];

  @IsOptional()
  @IsString()
  public sku?: string;

  @IsString()
  @IsOptional()
  public barcode?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  public attributes?: ProductAttributeDto[];

  @IsOptional()
  @Type(() => OptionDto)
  @ValidateNested({ each: true })
  public readonly options?: OptionDto[];

  public static parse(pvi: ImportVariantDto): ProductVariantsDto {
    return {
      id: pvi._id,

      attributes: pvi.attributes,
      barcode: pvi.barcode,
      description: pvi.description,
      images: pvi.images,
      imagesUrl: pvi.imagesUrl,
      options: pvi.options,
      price: pvi.price,
      sale: {
        ...pvi.sale,
      },
      sku: pvi.sku,
      title: pvi.title,
    };
  }
}
