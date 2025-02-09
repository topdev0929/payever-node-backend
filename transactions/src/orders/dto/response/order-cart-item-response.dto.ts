import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { OrderCartItemAttributesResponseDto } from './order-cart-item-attributes-response.dto';

@Exclude()
export class OrderCartItemResponseDto {
  @Expose()
  public identifier: string;

  @Expose()
  public name: string;

  @Expose()
  public brand?: string;

  @Expose()
  public quantity: number;

  @Expose()
  public sku?: string;

  @Expose()
  public unit_price: number;

  @IsNumber()
  @Expose()
  public tax_rate?: number;

  @Expose()
  public total_amount: number;

  @Expose()
  public total_tax_amount?: number;

  @Expose()
  public description?: string;

  @Expose()
  public image_url?: string;

  @Expose()
  public product_url?: string;

  @Expose()
  public category?: string;

  @Type(() => OrderCartItemAttributesResponseDto)
  @Expose()
  public attributes?: OrderCartItemAttributesResponseDto;
}
