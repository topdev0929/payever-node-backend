import { Type } from 'class-transformer';
import { CheckoutFlowDto } from './checkout-flow.dto';
import { IsDefined, ValidateNested } from 'class-validator';

export class CheckoutFlowMessageDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => CheckoutFlowDto)
  public flow: CheckoutFlowDto;
}
