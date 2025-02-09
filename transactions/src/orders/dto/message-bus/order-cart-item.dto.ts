import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { OrderCartItemAttributesDto } from './order-cart-item-attributes.dto';

@Exclude()
export class OrderCartItemDto {
  @IsString()
  @Expose()
  public identifier: string;

  @IsString()
  @Expose()
  public name: string;

  @IsString()
  @Expose()
  public brand?: string;

  @IsNumber()
  @Expose()
  public quantity: number;

  @IsString()
  @Expose()
  public sku?: string;

  @IsNumber()
  @Expose()
  public unit_price: number;

  @IsNumber()
  @Expose()
  public tax_rate?: number;

  @IsNumber()
  @Expose()
  public total_amount: number;

  @IsNumber()
  @Expose()
  public total_tax_amount?: number;

  @IsString()
  @Expose()
  public description?: string;

  @IsString()
  @Expose()
  public image_url?: string;

  @IsString()
  @Expose()
  public product_url?: string;

  @IsString()
  @Expose()
  public category?: string;

  @Type(() => OrderCartItemAttributesDto)
  @Expose()
  public attributes?: OrderCartItemAttributesDto;
}
