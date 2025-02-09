import { PaymentNotificationTransactionDto } from '../payment-notification-transaction.dto';
import { PaymentActionsEnum } from '@pe/payments-sdk';
import { PaymentEventTypesEnum } from '../../enums';
import { PaymentNotificationErrorDto } from '../payment-notification-error.dto';

export class PaymentEventDto {
  public payment: PaymentNotificationTransactionDto;
  public action?: PaymentActionsEnum;
  public action_source?: string;
  public amount?: number;
  public reference?: string;
  public unique_identifier?: string;
  public payment_event?: PaymentEventTypesEnum;
  public error?: PaymentNotificationErrorDto;
  public event_source?: string;
}
