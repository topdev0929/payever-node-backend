import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { OrderAddressIncomingDto } from './order-address-incoming.dto';
import { OrderPurchaseIncomingDto } from './order-purchase-incoming.dto';
import { OrderCustomerIncomingDto } from './order-customer-incoming.dto';
import { OrderCartItemIncomingDto } from './order-cart-item-incoming.dto';

@Exclude()
export class OrderIncomingDto {
  @ApiProperty()
  @IsString()
  @Expose()
  public id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public business_id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public reference: string;

  @ApiProperty()
  @IsDate()
  @Expose()
  public created_at: Date;

  @ApiProperty()
  @IsDate()
  @Expose()
  public updated_at: Date;

  @ApiProperty()
  @Type(() => OrderAddressIncomingDto)
  @Expose()
  public billing_address: OrderAddressIncomingDto;

  @ApiProperty()
  @Type(() => OrderAddressIncomingDto)
  @Expose()
  public shipping_address: OrderAddressIncomingDto;

  @ApiProperty()
  @Type(() => OrderPurchaseIncomingDto)
  @Expose()
  public purchase: OrderPurchaseIncomingDto;

  @ApiProperty()
  @Type(() => OrderCustomerIncomingDto)
  @Expose()
  public customer: OrderCustomerIncomingDto;

  @ApiProperty()
  @Type(() => OrderCartItemIncomingDto)
  @Expose()
  public cart: OrderCartItemIncomingDto[];
}
