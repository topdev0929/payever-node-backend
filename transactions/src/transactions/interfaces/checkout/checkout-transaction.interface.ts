import { AddressInterface } from '../address.interface';
import { UnpackedDetailsAwareInterface } from '../awareness';
import { ChannelSetInterface } from '../channel-set.interface';
import { PaymentFlowInterface } from '../payment-flow.interface';
import { TransactionBusinessInterface } from '../transaction-business.interface';
import { CheckoutTransactionCartItemInterface } from './checkout-transaction-cart-item.interface';
import { CheckoutTransactionHistoryItemInterface } from './checkout-transaction-history-item.interface';
import { CheckoutTransactionSellerInterface } from './checkout-transaction-seller.interface';

export interface CheckoutTransactionInterface extends UnpackedDetailsAwareInterface {
  id: string;
  uuid: string;

  address?: AddressInterface;
  api_call_id?: string;
  business?: TransactionBusinessInterface;
  channel_set?: ChannelSetInterface;
  order_id?: string;
  payment_flow?: PaymentFlowInterface;

  action_running: boolean;
  amount: number;
  business_option_id: number;
  business_uuid: string;
  channel: string; // 'store', ...
  channel_uuid: string;
  channel_set_id?: string;
  /** @deprecated */
  channel_set_uuid: string;
  channel_source?: string;
  plugin_version?: string;
  channel_type?: string;
  created_at: string;
  currency: string;
  customer_email: string;
  customer_name: string;
  customer_type?: string;
  delivery_fee: number;
  down_payment: number;
  fee_accepted: boolean;
  history: CheckoutTransactionHistoryItemInterface[];
  items: CheckoutTransactionCartItemInterface[];
  merchant_email: string;
  merchant_name: string;
  payment_fee: number;
  payment_flow_id: string;
  place: string;
  reference: string;
  santander_applications?: string[];
  shipping_address: AddressInterface;
  shipping_category: string;
  shipping_method_name: string;
  shipping_option_name: string;
  specific_status: string;
  status: string;
  status_color: string;
  store_id: string;
  store_name: string;
  total: number;
  type: string;
  updated_at: string;
  user_uuid: string;
  payment_type?: string;
  payment_issuer?: string;
  pos_merchant_mode?: boolean;
  pos_verify_type?: number;
  seller?: CheckoutTransactionSellerInterface;


  amount_captured?: number;
  amount_canceled?: number;
  amount_invoiced?: number;
  amount_refunded?: number;

  amount_capture_rest?: number;
  amount_cancel_rest?: number;
  amount_invoice_rest?: number;
  amount_refund_rest?: number;
}
