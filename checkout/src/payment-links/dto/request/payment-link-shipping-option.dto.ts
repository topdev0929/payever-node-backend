import { ShippingOptionCategoryEnum } from '../../../legacy-api';
import { Exclude, Expose, Type } from 'class-transformer';
import { PaymentLinkShippingOptionDetailsDto } from './payment-link-shipping-option-details.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';

@Exclude()
export class PaymentLinkShippingOptionDto {
  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public name?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public carrier?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsEnum(ShippingOptionCategoryEnum)
  public category?: ShippingOptionCategoryEnum;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsNumber()
  public price?: number;

  @Expose( { name: 'taxRate'})
  @ApiProperty({ required: false, name: 'taxRate'})
  @IsOptional()
  @IsNumber()
  public tax_rate?: number;

  @Expose({ name: 'taxAmount'})
  @ApiProperty({ required: false, name: 'taxAmount'})
  @IsOptional()
  @IsNumber()
  public tax_amount?: number;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @Type( () => PaymentLinkShippingOptionDetailsDto)
  public details?: PaymentLinkShippingOptionDetailsDto;
}
