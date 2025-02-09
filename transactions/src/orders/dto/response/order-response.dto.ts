import { Exclude, Expose, Type } from 'class-transformer';
import { OrderStatusesEnum } from '../../enum';
import { OrderAddressResponseDto } from './order-address-response.dto';
import { OrderPurchaseResponseDto } from './order-purchase-response.dto';
import { OrderCustomerResponseDto } from './order-customer-response.dto';
import { OrderCartItemResponseDto } from './order-cart-item-response.dto';

@Exclude()
export class OrderResponseDto {
  @Expose()
  public id: string;

  @Expose()
  public business_id: string;

  @Expose()
  public reference: string;

  @Expose()
  public status: OrderStatusesEnum;

  @Expose()
  public created_at: Date;

  @Type(() => OrderAddressResponseDto)
  @Expose()
  public billing_address: OrderAddressResponseDto;

  @Type(() => OrderAddressResponseDto)
  @Expose()
  public shipping_address: OrderAddressResponseDto;

  @Type(() => OrderPurchaseResponseDto)
  @Expose()
  public purchase: OrderPurchaseResponseDto;

  @Type(() => OrderCustomerResponseDto)
  @Expose()
  public customer: OrderCustomerResponseDto;

  @Type(() => OrderCartItemResponseDto)
  @Expose()
  public cart: OrderCartItemResponseDto[];
}
