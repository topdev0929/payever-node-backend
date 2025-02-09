import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { TransactionDto } from './transaction.dto';
import { HistoryItemDto } from './history-item.dto';
import { Type } from 'class-transformer';

export class GetTransactionActionDto {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => TransactionDto)
  public transaction: TransactionDto;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => HistoryItemDto)
  public history: HistoryItemDto[];
}
