import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductPriceConditionDto } from './product-price-condition.dto';
import { ProductSaleDto } from './product-sale.dto';

export class ProductPriceDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ProductPriceConditionDto)
  public condition: ProductPriceConditionDto;

  @IsNotEmpty()
  @IsString()
  public currency: string;

  @IsNotEmpty()
  @IsNumber()
  public price: number;

  @IsOptional()
  @Type(() => ProductSaleDto)
  public sale?: ProductSaleDto;

  @IsOptional()
  @IsNumber()
  public vatRate?: number;
}
