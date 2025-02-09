import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OptionDto } from '../option.dto';
import { ProductAttributeDto, ProductSaleDto } from '../';

export class ImportVariantDto {
  public readonly _id?: string;

  public readonly imagesUrl?: string[];

  @IsArray()
  @IsOptional()
  public images?: string[];

  @IsNotEmpty()
  @IsString()
  public title: string;

  @IsNotEmpty()
  @IsString()
  public description: string;

  @IsDefined()
  @IsBoolean()
  public onSales: boolean;

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
  public barcode?: string;

  /** @deprecated */
  @IsOptional()
  @ValidateNested({ each: true})
  @Type(() => OptionDto)
  public options?: OptionDto[];

  @IsOptional()
  @ValidateNested({ each: true})
  @Type(() => ProductAttributeDto)
  public attributes?: ProductAttributeDto[];
}
