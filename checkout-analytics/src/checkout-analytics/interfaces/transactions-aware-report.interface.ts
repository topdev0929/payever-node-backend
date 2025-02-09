import { PaymentInterface } from './payment.interface';

export interface TransactionsAwareReportInterface {
  approvedTransactions: Map<string, PaymentInterface>;
  rejectedTransactions: Map<string, PaymentInterface>;
}
