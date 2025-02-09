import { Expose } from 'class-transformer';
import { IsArray } from 'class-validator';
import { PaymentMethodVariantDto } from './payment-method-variant.dto';
import { PaymentMethodDto } from './payment-method.dto';

export class PaymentMethodWithVariantsDto extends PaymentMethodDto {
  @IsArray()
  @Expose()
  public variants: PaymentMethodVariantDto[];
}
