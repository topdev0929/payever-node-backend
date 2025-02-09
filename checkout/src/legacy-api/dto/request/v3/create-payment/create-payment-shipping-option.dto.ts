import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ShippingOptionCategoryEnum } from '../../../../enum';
import { CreatePaymentShippingOptionDetailsDto } from './create-payment-shipping-option-details.dto';

export class CreatePaymentShippingOptionDto {
  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['link']})
  public name?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public carrier?: string;

  @ApiProperty({ required: false, enum: ShippingOptionCategoryEnum})
  @IsEnum(ShippingOptionCategoryEnum, { groups: ['create', 'submit', 'link']})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public category?: ShippingOptionCategoryEnum;

  @ApiProperty()
  @IsNumber({ }, { groups: ['create', 'submit', 'link']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['link']})
  public price?: number;

  @ApiProperty()
  @IsNumber({ }, { groups: ['create', 'submit', 'link']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['link']})
  public tax_rate?: number;

  @ApiProperty()
  @IsNumber({ }, { groups: ['create', 'submit', 'link']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['link']})
  public tax_amount?: number;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @Type(() => CreatePaymentShippingOptionDetailsDto)
  @ValidateNested({ groups: ['create', 'submit', 'link']})
  public details?: CreatePaymentShippingOptionDetailsDto;
}
