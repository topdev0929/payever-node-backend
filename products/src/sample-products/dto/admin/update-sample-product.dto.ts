import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { ProductTypeEnum } from '../../../products/enums';
import { ProductShippingDto } from '../../../products/dto';

export class UpdateSampleProductDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public active: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public barcode: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  public businessId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public currency: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public description: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public example: boolean;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public images: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  public industry: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public onSales: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public price: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public product: string;

  @ApiProperty()
  @ValidateIf((o: any) => o.onSales)
  @IsNumber()
  @IsNotEmpty()
  public salePrice: number;

  @ApiProperty({ required: false })
  @ValidateNested()
  @Type(() => ProductShippingDto)
  @IsOptional()
  public shipping: ProductShippingDto;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public sku: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public title: string;

  @ApiProperty()
  @IsEnum(ProductTypeEnum)
  @IsOptional()
  public type: ProductTypeEnum;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  public vatRate?: number;
}
