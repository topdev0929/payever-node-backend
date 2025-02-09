import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateOrderAddressDto } from './create-order-address.dto';
import { CreateOrderCustomerDto } from './create-order-customer.dto';
import { CreateOrderPurchaseDto } from './create-order-purchase.dto';
import { CreateOrderCartItemDto } from './create-order-cart-item.dto';

export class CreateOrderWrapperDto {
  @ApiProperty()
  @IsString({ groups: ['create']})
  @IsNotEmpty({ groups: ['create']})
  @Type(() => String)
  public reference: string;

  @ApiProperty()
  @IsNotEmpty({ groups: ['create']})
  @Type(() => CreateOrderPurchaseDto)
  @ValidateNested({ groups: ['create']})
  public purchase?: CreateOrderPurchaseDto;

  @ApiProperty()
  @IsOptional({ groups: ['create']})
  @Type(() => CreateOrderCustomerDto)
  @ValidateNested({ groups: ['create']})
  public customer?: CreateOrderCustomerDto;

  @ApiProperty({ type: CreateOrderCartItemDto, isArray: true})
  @IsOptional({ groups: ['create']})
  @Type(() => CreateOrderCartItemDto)
  @ValidateNested({ groups: ['create'], each: true})
  public cart?: CreateOrderCartItemDto[];

  @ApiProperty()
  @IsOptional({ groups: ['create']})
  @Type(() => CreateOrderAddressDto)
  @ValidateNested({ groups: ['create']})
  public billing_address?: CreateOrderAddressDto;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create']})
  @Type(() => CreateOrderAddressDto)
  @ValidateNested({ groups: ['create']})
  public shipping_address?: CreateOrderAddressDto;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public business_id?: string;
}
