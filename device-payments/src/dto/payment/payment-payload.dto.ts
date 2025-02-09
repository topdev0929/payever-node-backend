import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentPayloadInterface } from 'src/interfaces';
import { CheckoutPaymentDto } from '../checkout';

export class PaymentPayloadDto implements PaymentPayloadInterface {
  @ValidateNested()
  @Type(() => CheckoutPaymentDto)
  public payment: CheckoutPaymentDto;
}
