import { PaymentDetailDto } from './payment';

export class PaymentOptionDto {
  public payment_method: string;
  public payment_details?: PaymentDetailDto;
}
