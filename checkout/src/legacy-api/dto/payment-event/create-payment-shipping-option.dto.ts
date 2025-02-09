import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePaymentShippingOptionDetailsDto } from './create-payment-shipping-option-details.dto';

@Exclude()
export class CreatePaymentShippingOptionDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Expose()
  public name?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Expose()
  public carrier?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Expose()
  public category?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Expose()
  public price?: number;
  
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Expose()
  public tax_rate?: number;
  
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Expose()
  public tax_amount?: number;
  
  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePaymentShippingOptionDetailsDto)
  @Expose()
  public details?: CreatePaymentShippingOptionDetailsDto;
  
}
