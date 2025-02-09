import { Exclude, Expose, Type } from 'class-transformer';
import { PaymentMethodRequestInterface } from '../../../../interfaces';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaymentMethodsAddressRequestDto } from './payment-methods-address-request.dto';
import { PaymentMethodSortingRequestDto } from './payment-method-sorting-request.dto';

@Exclude()
export class PaymentMethodRequestDto implements PaymentMethodRequestInterface {
  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  public amount?: number;

  @Expose({ name: 'billing_address'})
  @Type(() => PaymentMethodsAddressRequestDto)
  @ApiPropertyOptional({ name: 'billing_address'})
  @IsOptional()
  public billingAddress?: PaymentMethodsAddressRequestDto;

  @Expose({ name: 'blocked_payment_methods'})
  @ApiPropertyOptional({ name: 'blocked_payment_methods'})
  @IsOptional()
  public blockedPaymentMethods?: string[];

  @Expose({ name: 'business_id'})
  @ApiPropertyOptional({ name: 'business_id'})
  @IsOptional()
  public businessId?: string;

  @Expose()
  @ApiProperty()
  @IsString()
  public channel: string;

  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  public country?: string;

  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  public currency?: string;

  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  public locale?: string = 'en';

  @Expose({ name: 'shipping_address'})
  @ApiPropertyOptional({ name: 'shipping_address'})
  @IsOptional()
  @Type(() => PaymentMethodsAddressRequestDto)
  public shippingAddress?: PaymentMethodsAddressRequestDto;

  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => PaymentMethodSortingRequestDto)
  public sorting: PaymentMethodSortingRequestDto;
}

