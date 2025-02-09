import { PaymentMailDto } from '../dto/payment';

export interface PaymentMailInterface {
  eventData: PaymentMailDto;
  templateName: string;
  transactionId: string;
}
