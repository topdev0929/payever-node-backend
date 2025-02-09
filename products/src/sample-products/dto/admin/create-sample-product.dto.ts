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

export class CreateSampleProductDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  public active: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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
  @IsNotEmpty()
  public description: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  public example: boolean;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  public images: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public industry: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  public onSales: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public price: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public product: string;

  @ApiProperty()
  @ValidateIf((o: any) => o.onSales)
  @IsNumber()
  @IsNotEmpty()
  public salePrice: number;

  @ApiProperty({ required: false, type: ProductShippingDto })
  @ValidateNested()
  @Type(() => ProductShippingDto)
  @IsOptional()
  public shipping: ProductShippingDto;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public sku: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty({ enum: Object.values(ProductTypeEnum) })
  @IsEnum(ProductTypeEnum)
  @IsNotEmpty()
  public type: ProductTypeEnum;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  public vatRate?: number;
}
