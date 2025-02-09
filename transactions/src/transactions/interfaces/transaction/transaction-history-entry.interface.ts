import { HistoryEventUserInterface } from '../history-event-message';
import { TransactionCartItemInterface } from './transaction-cart-item.interface';

export interface TransactionHistoryEntryInterface {
  action: string;
  amount: number;
  currency?: string;
  delivery_fee?: number;
  payment_status: string;
  psp_status?: string;
  requirements_state?: string;
  created_at: Date;
  params?: { };
  reason?: string;
  mail_event?: {
    event_id: string;
    template_name: string;
  };
  user?: HistoryEventUserInterface;
  reference?: string;

  items?: TransactionCartItemInterface[];

  business_id?: string;
  transaction_id?: string;
  /** @deprecated */
  request_data?: any;
  status?: string;
  error?: string;
  execution_time?: string;
  idempotency_key?: string;
  is_external_api_call?: boolean;
}
