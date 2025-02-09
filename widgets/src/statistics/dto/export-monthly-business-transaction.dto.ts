import { IsNotEmpty, ValidateNested, IsString, IsNumber } from 'class-validator';

export class ExportMonthlyBusinessTransactionDto {
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @IsNotEmpty()
  @IsNumber()
  public amount: number;

  @IsNotEmpty()
  @IsString()
  public date: string;

  @IsNotEmpty()
  @IsNumber()
  public refund: number;

  @IsNotEmpty()
  @ValidateNested()
  public transactions: MonthlyBusinessTransactionInterface[];
}

export interface MonthlyBusinessTransactionInterface {
  id: string;
  currency: string;
}
