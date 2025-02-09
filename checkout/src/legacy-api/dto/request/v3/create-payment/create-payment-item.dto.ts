import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePaymentItemAttributesDto } from './create-payment-item-attributes.dto';
import { CartItemTypeEnum } from '../../../../../common/enum';

export class CreatePaymentItemDto {
  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  public identifier: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  public name: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public brand?: string;

  @ApiProperty()
  @IsNumber({ }, { groups: ['create', 'submit']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  public quantity: number;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public sku?: string;

  @ApiProperty()
  @IsNumber({ }, { groups: ['create', 'submit']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  public unit_price: number;

  @ApiProperty({ required: false})
  @IsNumber({ }, { groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public tax_rate?: number;

  @ApiProperty()
  @IsNumber({ }, { groups: ['create', 'submit']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  public total_amount: number;

  @ApiProperty({ required: false})
  @IsNumber({ }, { groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public total_tax_amount?: number;

  @ApiProperty({ required: false})
  @IsNumber({ }, { groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public total_discount_amount?: number;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public description?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public image_url?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public product_url?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public category?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  @Type(() => CreatePaymentItemAttributesDto)
  @ValidateNested({ groups: ['create', 'submit']})
  public attributes?: CreatePaymentItemAttributesDto;

  @ApiProperty({ required: false})
  @IsEnum(CartItemTypeEnum, { groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public type?: CartItemTypeEnum;
}
