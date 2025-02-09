import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

import { UserAccountDto } from './user-account.dto';
import { BusinessInterface } from '../interfaces';
import { TransactionRetentionPeriod } from '../constraints';

export class BusinessDto implements BusinessInterface {
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsOptional()
  @Type(() => UserAccountDto)
  public userAccount: UserAccountDto;

  @IsOptional()
  @IsString()
  @TransactionRetentionPeriod()
  public transactionsRetentionPeriod?: string;

  @IsOptional()
  @IsString()
  @TransactionRetentionPeriod()
  public failedTransactionsRetentionPeriod?: string;

  @IsOptional()
  @IsString()
  public currency?: string;

  @IsOptional()
  @IsBoolean()
  public isDeleted?: boolean;
}
