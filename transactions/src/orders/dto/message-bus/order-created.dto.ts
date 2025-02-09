import { IsDate, IsString } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { OrderPurchaseDto } from './order-purchase.dto';
import { OrderCustomerDto } from './order-customer.dto';
import { OrderAddressDto } from './order-address.dto';
import { OrderCartItemDto } from './order-cart-item.dto';

@Exclude()
export class OrderCreatedDto {
  @IsString()
  @Expose()
  public business_id: string;

  @IsString()
  @Expose()
  public reference: string;

  @Type(() => OrderPurchaseDto)
  @Expose()
  public purchase: OrderPurchaseDto;

  @Type(() => OrderCustomerDto)
  @Expose()
  public customer: OrderCustomerDto;

  @Type(() => OrderCartItemDto)
  @Expose()
  public cart: OrderCartItemDto[];

  @Type(() => OrderAddressDto)
  @Expose()
  public billing_address: OrderAddressDto;

  @Type(() => OrderAddressDto)
  @Expose()
  public shipping_address: OrderAddressDto;

  @IsDate()
  @Expose()
  public created_at: Date;

  @IsDate()
  @Expose()
  public updated_at: Date;
}
