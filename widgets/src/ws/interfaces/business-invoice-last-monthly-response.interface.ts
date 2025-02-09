import { MessageResponseInterface } from './message-response.interface';

export interface BusinessInvoiceLastMonthlyResponseInterface extends MessageResponseInterface {
  id?: string;
  invoices?: any[];
}
