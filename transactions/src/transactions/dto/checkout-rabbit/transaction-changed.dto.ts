import { ValidateNested, IsDefined, IsEnum, IsOptional } from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { TransactionDto } from './transaction.dto';
import { PaymentActionsEnum } from '../../enum';

export class TransactionChangedDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => TransactionDto)
  public payment: TransactionDto;

  @Expose()
  @IsEnum(PaymentActionsEnum)
  @IsOptional()
  public action?: PaymentActionsEnum;
}
