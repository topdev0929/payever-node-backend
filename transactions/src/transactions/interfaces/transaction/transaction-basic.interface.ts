import { AddressInterface } from '../address.interface';
import { SantanderApplicationAwareInterface } from '../awareness';
import { TransactionCartItemInterface } from './transaction-cart-item.interface';
import { TransactionHistoryEntryInterface } from './transaction-history-entry.interface';
import { TransactionRefundItemInterface } from './transaction-refund-item.interface';

export interface TransactionBasicInterface extends SantanderApplicationAwareInterface {
  id: string;
  original_id: string; // id from mysql db
  uuid: string;
  action_running: boolean;
  amount: number;
  amount_capture_rest?: number;
  amount_capture_rest_with_partial_cancel?: number;
  amount_captured?: number;
  amount_canceled?: number;
  amount_cancel_rest?: number;
  amount_invoiced?: number;
  amount_invoice_rest?: number;
  amount_refunded?: number;
  amount_refund_rest_with_partial_capture?: number;
  amount_left?: number;
  /**
   * @deprecated use amount_left instead of amount_refund_rest
   */
  amount_refund_rest?: number;
  api_call_id?: string;
  available_refund_items?: TransactionRefundItemInterface[];
  billing_address: AddressInterface;
  business_option_id?: number;
  business_uuid: string;
  channel: string; // 'store', ...
  channel_uuid: string;
  channel_set_id?: string;
  /** @deprecated */
  channel_set_uuid: string;
  channel_source?: string;
  plugin_version?: string;
  channel_type?: string;
  created_at: Date;
  currency: string;
  customer_email: string;
  customer_name: string;
  customer_type?: string;
  delivery_fee: number;
  down_payment: number;
  fee_accepted: boolean;
  history: TransactionHistoryEntryInterface[];

  captured_items?: TransactionCartItemInterface[];
  items: TransactionCartItemInterface[];
  refunded_items?: TransactionCartItemInterface[];

  merchant_email: string;
  merchant_name: string;
  order_id?: string;
  payment_fee: number;
  payment_flow_id: string;
  place: string;
  pos_merchant_mode?: boolean;
  pos_verify_type?: number;
  reference: string;
  shipping_address: AddressInterface;
  shipping_category: string;
  shipping_method_name: string;
  shipping_option_name: string;
  shipping_order_id: string;
  seller_name?: string;
  seller_email?: string;
  seller_id?: string;
  is_shipping_order_processed: boolean;
  specific_status: string;
  status: string;
  status_color: string;
  store_id: string;
  store_name: string;
  total: number;
  total_left?: number;
  type: string;
  payment_issuer?: string;
  updated_at: Date;
  user_uuid: string;

  delivery_fee_refunded: number;
  delivery_fee_captured: number;
  delivery_fee_canceled: number;
  delivery_fee_left: number;

  example?: boolean;
  example_shipping_label?: string;
  example_shipping_slip?: string;

  anonymized?: boolean;
}
