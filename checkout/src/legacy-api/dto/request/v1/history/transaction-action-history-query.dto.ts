import { IsNumber, IsOptional, Max } from 'class-validator';

export class TransactionActionHistoryQueryDto {

  @IsOptional()
  @IsNumber()
  @Max(20)
  public limit?: number = 10;
}
