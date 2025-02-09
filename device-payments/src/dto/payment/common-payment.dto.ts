import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { classToPlain, Transform, Type } from 'class-transformer';
import { Salutation } from '../../enum';
import { AddressDto } from '../address.dto';
import { PaymentCartDto } from './payment-cart.dto';

export class CommonPaymentDto {
  /** @deprecated */
  @ApiProperty()
  @IsOptional()
  @IsString()
  public terminal_id?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public application_id?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public application_type?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform((value: any) => Number(value))
  public amount: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public reference?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEnum(Salutation)
  public salutation?: Salutation;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public first_name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public last_name?: string;

  @ApiProperty()
  @IsOptional()
  public address: AddressDto;

  @ApiProperty()
  @IsOptional()
  @Type(() => PaymentCartDto)
  public cart: PaymentCartDto[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  public seller_email: string;

  @Allow()
  /* tslint:disable-next-line */
  public asData(): any {
    const address: any = { };

    if (this.salutation) {
      address.salutation = this.salutation;
    }

    if (this.first_name) {
      address.firstName = this.first_name;
    }

    if (this.last_name) {
      address.lastName = this.last_name;
    }

    if (this.address) {
      for (const key of ['city', 'street', 'email' ]) {
        if (this.address[key]) {
          address[key] = this.address[key];
        }
      }

      if (this.address.country) {
        address.country = this.address.country;
      }

      if (this.address.zip_code) {
        address.zipCode = this.address.zip_code;
      }

      if (this.address.phone_number) {
        address.phone = this.address.phone_number;
      }
    }

    if (this.salutation) {
      address.salutation = this.salutation;
    }

    let cart: any = null;

    if (this.cart && Array.isArray(this.cart) && this.cart.length) {
      cart = classToPlain(this.cart);
    }

    const result: any = { flow: { billingAddress: address, cart: cart } };

    for (const key of ['amount', 'reference']) {
      if (this[key] !== null && this[key] !== undefined) {
        result.flow[key] = this[key];
      }
    }

    if (this.seller_email) {
      result.sellerEmail = this.seller_email;
    }

    return result;
  }
}
