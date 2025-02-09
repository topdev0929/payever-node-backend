import { TransactionEventPaymentDto } from '@pe/payments-sdk';

export class PaymentNotificationTransactionDto extends TransactionEventPaymentDto {
  public capture_amount?: number;
  public refund_amount?: number;
  public cancel_amount?: number;
}
