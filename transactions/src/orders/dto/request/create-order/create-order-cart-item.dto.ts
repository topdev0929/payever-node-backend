import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderCartItemAttributesDto } from './create-order-cart-item-attributes.dto';

export class CreateOrderCartItemDto {
  @ApiProperty()
  @IsString({ groups: ['create']})
  @IsNotEmpty({ groups: ['create']})
  public identifier: string;

  @ApiProperty()
  @IsString({ groups: ['create']})
  @IsNotEmpty({ groups: ['create']})
  public name: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public brand?: string;

  @ApiProperty()
  @IsNumber({ }, { groups: ['create']})
  @IsNotEmpty({ groups: ['create']})
  public quantity: number;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public sku?: string;

  @ApiProperty()
  @IsNumber({ }, { groups: ['create']})
  @IsNotEmpty({ groups: ['create']})
  public unit_price: number;

  @ApiProperty({ required: false})
  @IsNumber({ }, { groups: ['create']})
  @IsOptional({ groups: ['create']})
  public tax_rate?: number;

  @ApiProperty()
  @IsNumber({ }, { groups: ['create']})
  @IsNotEmpty({ groups: ['create']})
  public total_amount: number;

  @ApiProperty({ required: false})
  @IsNumber({ }, { groups: ['create']})
  @IsOptional({ groups: ['create']})
  public total_tax_amount?: number;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public description?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public image_url?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public product_url?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public category?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create']})
  @Type(() => CreateOrderCartItemAttributesDto)
  @ValidateNested({ groups: ['create']})
  public attributes?: CreateOrderCartItemAttributesDto;
}
