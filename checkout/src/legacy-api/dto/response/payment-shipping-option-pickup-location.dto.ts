import { IsOptional } from 'class-validator';
import { Type, Expose, Exclude } from 'class-transformer';
import { PaymentShippingOptionAddressDto } from './payment-shipping-option-address.dto';

@Exclude()
export class PaymentShippingOptionPickupLocationDto {
  @Expose()
  @IsOptional()
  public id?: string;

  @Expose()
  @IsOptional()
  public name?: string;

  @Expose()
  @IsOptional()
  @Type(() => PaymentShippingOptionAddressDto)
  public address?: PaymentShippingOptionAddressDto;
}
