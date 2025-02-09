import { PaymentAddressInterface } from './payment-address.interface';

export interface PaymentInterface {
  uuid: string;
  original_id: string;
  readonly status: string;
  readonly specific_status: string;
  readonly color_state: string;
  readonly merchant_name: string;
  readonly customer_name: string;
  readonly customer_type?: string;
  readonly payment_issuer?: string;
  readonly payment_type: string;
  readonly customer_email: string;
  readonly created_at: Date | string;
  readonly updated_at: Date | string;
  readonly channel: string;
  readonly channel_set_id?: string;
  readonly channel_source?: string;
  readonly channel_type?: string;
  readonly reference: string;
  readonly amount: number;
  readonly total: number;
  readonly currency: string;
  readonly shipping_category?: string;
  readonly shipping_method_name?: string;
  readonly shipping_option_name?: string;
  readonly delivery_fee: number;
  readonly payment_fee: number;
  readonly down_payment: number;
  readonly business_option_id: string;
  readonly payment_details?: [];
  readonly business_uuid?: string;
  readonly history?: any[];
  readonly items?: any[];
  readonly shipping_option?: any;
  /** @deprecated */
  readonly channel_set_uuid?: string;
  readonly billing_address: PaymentAddressInterface;
  readonly shipping_address?: PaymentAddressInterface;
  readonly api_call_id?: string;
}
