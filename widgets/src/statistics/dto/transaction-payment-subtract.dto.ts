import { IsNotEmpty, IsNumber, IsString, ValidateNested, IsDateString } from 'class-validator';
import { CheckoutTransactionHistoryItemInterface } from '../interfaces';

export class TransactionPaymentSubtractDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @ValidateNested()
  public business: BusinessInterface;

  public customer: {
    email: string;
    name: string;
  };

  public user: {
    id: string;
  };

  @IsNotEmpty()
  @ValidateNested()
  public channel_set: ChannelSetInterface;

  @IsNumber()
  @IsNotEmpty()
  public amount: number;

  @IsDateString()
  public date: string;

  @IsDateString()
  public last_updated: string;

  public history: CheckoutTransactionHistoryItemInterface[];
}

interface ChannelSetInterface {
  id: string;
}

interface BusinessInterface {
  id: string;
}
