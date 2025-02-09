import { TransactionDto } from './transaction.dto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ShippingDto } from './shipping.dto';
import { StatusDto } from './status.dto';
import { PaymentOptionDto } from './payment-option.dto';

export class GetTransactionActionsDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TransactionDto)
  public transaction: TransactionDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShippingDto)
  public shipping: ShippingDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaymentOptionDto)
  public payment_option: PaymentOptionDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => StatusDto)
  public status: StatusDto;
}
