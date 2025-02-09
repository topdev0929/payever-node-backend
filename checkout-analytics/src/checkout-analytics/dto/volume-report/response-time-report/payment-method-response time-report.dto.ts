import { IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { PaymentMethodsEnum } from '../../../enums';
import { ResponseTimeStateDto } from './response-time-state.dto';

@Exclude()
export class PaymentMethodResponseTimeReportDto extends ResponseTimeStateDto {
  @IsString()
  @Expose()
  public paymentMethod: PaymentMethodsEnum;

  constructor(paymentMethod: PaymentMethodsEnum) {
    super();

    this.paymentMethod = paymentMethod;
  }
}
