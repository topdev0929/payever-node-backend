import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsNumber } from 'class-validator';
import { PaymentMethodOptionsInterface } from '../../../common/interfaces';

export class PaymentMethodLimitsDto {
  @IsNumber()
  @Exclude()
  public max: number;

  @IsNumber()
  @Expose()
  public min: number;

  @Expose()
  public options: PaymentMethodOptionsInterface;

  @IsBoolean()
  @Expose()
  public shipping_address_equality: boolean;

  @IsBoolean()
  @Expose()
  public shipping_address_allowed: boolean;
}
