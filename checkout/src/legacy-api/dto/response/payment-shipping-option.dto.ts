import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { PaymentShippingOptionDetailsDto } from './payment-shipping-option-details.dto';

@Exclude()
export class PaymentShippingOptionDto {
  @IsOptional()
  @IsString()
  @Expose()
  public name?: string;

  @IsOptional()
  @IsString()
  @Expose()
  public carrier?: string;

  @IsOptional()
  @IsString()
  @Expose()
  public category?: string;

  @IsOptional()
  @IsNumber()
  @Expose()
  public price?: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  public tax_rate?: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  public tax_amount?: number;

  @IsOptional()
  @Expose()
  @Type(() => PaymentShippingOptionDetailsDto)
  public details?: PaymentShippingOptionDetailsDto;
}
