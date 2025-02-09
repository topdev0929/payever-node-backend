import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ProductTypeEnum } from '../enum';
import { ProductShippingDto } from './product-shipping.dto';
import { ProductVariantDto } from './product-variant.dto';

export class ProductDto {
  @ApiProperty()
  @IsString()
  public sku: string;

  @ApiProperty()
  @IsNumber()
  public price: number;

  @ApiProperty()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsOptional()
  public imagesUrl?: string[];

  @ApiProperty()
  @IsOptional()
  public images?: string[];

  @ApiProperty()
  @IsOptional()
  public currency?: string;

  @ApiProperty()
  @IsEnum(ProductTypeEnum)
  @IsOptional()
  public type?: ProductTypeEnum;

  @ApiProperty()
  @IsOptional()
  public categories?: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  public description?: string;

  @IsBoolean()
  @IsOptional()
  public onSales?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public active?: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public salePrice?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public barcode?: string;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  public createdAt?: Date;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  public updatedAt?: Date;

  @ApiProperty()
  @ValidateNested()
  @IsOptional()
  @Type(() => ProductShippingDto)
  public shipping?: ProductShippingDto;

  @ApiProperty()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ProductVariantDto)
  public variants?: ProductVariantDto[];
}
