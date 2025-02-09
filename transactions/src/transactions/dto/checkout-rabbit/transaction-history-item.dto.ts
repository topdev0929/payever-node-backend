import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CheckoutTransactionHistoryItemInterface } from '../../interfaces/checkout';

export class TransactionHistoryItemDto implements CheckoutTransactionHistoryItemInterface{
  @IsString()
  public action: string;
  @IsString()
  public payment_status: string;
  @IsNumber()
  public amount: number;
  @IsOptional()
  public params?: { };
  @IsString()
  @IsOptional()
  public reason?: string;
  @IsString()
  public created_at: string;
}
