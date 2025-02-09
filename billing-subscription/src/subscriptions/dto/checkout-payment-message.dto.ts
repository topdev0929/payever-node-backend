import { ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionRmqMessageDto } from './transaction.dto';

export class CheckoutPaymentRmqMessageDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => TransactionRmqMessageDto)
  public payment: TransactionRmqMessageDto;
}
