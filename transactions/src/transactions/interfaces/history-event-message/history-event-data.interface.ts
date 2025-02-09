import { HistoryEventUserInterface } from './history-event-user.interface';
import { TransactionCartItemInterface } from '../transaction';
import { HistoryApiCallStatusEnum } from '../../enum';

export interface HistoryEventDataInterface {
  amount?: number;
  delivery_fee?: number;
  payment_status: string;
  psp_status?: string;
  requirements_state?: string;
  reason?: string;
  params?: string;
  mail_event?: {
    event_id: string;
    template_name: string;
  };
  user?: HistoryEventUserInterface;
  reference?: string;
  /** @deprecated */
  request_data?: any;
  idempotency_key?: string;
  status?: HistoryApiCallStatusEnum;
  execution_time?: string;
  error?: string;
  is_external_api_call?: boolean;
  items?: TransactionCartItemInterface[];
}
