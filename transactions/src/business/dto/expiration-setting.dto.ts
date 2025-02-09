import { IsOptional, IsString, IsEnum } from 'class-validator';
import { BusinessInterface } from '../interfaces';
import { TransactionRetentionPeriod } from '../constraints';

export class TransactionRetentionSettingDto implements Partial<BusinessInterface> {
  @IsOptional()
  @IsString()
  @TransactionRetentionPeriod()
  public transactionsRetentionPeriod?: string;

  @IsOptional()
  @IsString()
  @TransactionRetentionPeriod()
  public failedTransactionsRetentionPeriod?: string;
}
