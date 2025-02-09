import { Expose } from 'class-transformer';
import { IsString, IsBoolean } from 'class-validator';
import { PaymentMethodOptionsInterface } from '../../../common';

export class PaymentMethodVariantDto {
  @IsString()
  @Expose()
  public readonly name: string;
  
  @IsString()
  @Expose()
  public readonly variant_id: string;

  @IsBoolean()
  @Expose()
  public readonly accept_fee: boolean;

  @IsBoolean()
  @Expose()
  public readonly shipping_address_allowed: boolean;

  @IsBoolean()
  @Expose()
  public readonly shipping_address_equality: boolean;

  @Expose()
  @Expose()
  public readonly options?: PaymentMethodOptionsInterface;
}
