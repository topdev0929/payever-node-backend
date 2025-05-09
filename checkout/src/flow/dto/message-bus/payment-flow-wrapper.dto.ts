import { ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentFlowDto } from './payment-flow.dto';

export class PaymentFlowWrapperDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => PaymentFlowDto)
  public flow: PaymentFlowDto;
}
