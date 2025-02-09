import { Type } from 'class-transformer';
import { CheckoutPaymentDto } from './checkout-payment.dto';
import { IsDefined, ValidateNested } from 'class-validator';

export class CheckoutPaymentMessageDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => CheckoutPaymentDto)
  public payment: CheckoutPaymentDto;
}
