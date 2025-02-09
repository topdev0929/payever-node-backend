import { PaymentMethodsEnum, TransactionStatusesEnum } from '../../enums';
export class AggregateTransactionsQueryDto {
  public paymentMethod?: PaymentMethodsEnum;
  public dateFrom: Date;
  public dateTo: Date;
  public businessId?: string;
  public excludedBusinessIds?: string[] = [];
  public status?: TransactionStatusesEnum = TransactionStatusesEnum.approved;
  public considerUpdatedTransactions?: boolean = true;
  public channel?: string;
}
