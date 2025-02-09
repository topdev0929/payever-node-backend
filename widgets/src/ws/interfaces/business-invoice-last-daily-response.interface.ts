import { MessageResponseInterface } from './message-response.interface';

export interface BusinessInvoiceLastDailyResponseInterface extends MessageResponseInterface {
  id?: string;
  invoices?: any[];
}
