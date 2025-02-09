import { ExportTransactionItemDto } from './export-transaction-item.dto';
import { ExportTransactionAddressDto } from './export-transaction-address.dto';
import { TransactionFoldersIndexDto } from '../transaction-folders-index';

export class ExportTransactionDto extends TransactionFoldersIndexDto {
  public payment_details: string;
  public items: ExportTransactionItemDto[];
  public shipping_address: ExportTransactionAddressDto;
  public billing_address: ExportTransactionAddressDto;
}
