import { Injectable, Logger } from '@nestjs/common';
import { TransactionPackedDetailsInterface, TransactionUnpackedDetailsInterface } from '../interfaces';

@Injectable()
export class TransactionPaymentDetailsConverter {

  public static convert(
    transaction: TransactionPackedDetailsInterface,
  ): TransactionUnpackedDetailsInterface {
    const unpacked: TransactionUnpackedDetailsInterface = {
      id: transaction.id,
      original_id: transaction.original_id,
      uuid: transaction.uuid,

      action_running: transaction.action_running,
      amount: transaction.amount,
      amount_cancel_rest: transaction.amount_cancel_rest,
      amount_canceled: transaction.amount_canceled,
      amount_capture_rest: transaction.amount_capture_rest,
      amount_capture_rest_with_partial_cancel: transaction.amount_capture_rest_with_partial_cancel,
      amount_captured: transaction.amount_captured,
      amount_invoice_rest: transaction.amount_invoice_rest,
      amount_invoiced: transaction.amount_invoiced,
      amount_left: transaction.amount_left,
      amount_refund_rest: transaction.amount_refund_rest,
      amount_refund_rest_with_partial_capture: transaction.amount_refund_rest_with_partial_capture,
      amount_refunded: transaction.amount_refunded,
      api_call_id: transaction.api_call_id,
      available_refund_items: transaction.available_refund_items,
      billing_address: transaction.billing_address,
      business_option_id: transaction.business_option_id,
      business_uuid: transaction.business_uuid,
      channel: transaction.channel,
      channel_set_uuid: transaction.channel_set_uuid,
      channel_uuid: transaction.channel_uuid,
      created_at: transaction.created_at,
      currency: transaction.currency,
      customer_email: transaction.customer_email,
      customer_name: transaction.customer_name,
      delivery_fee: transaction.delivery_fee,
      down_payment: transaction.down_payment,
      fee_accepted: transaction.fee_accepted,
      history: transaction.history,
      is_shipping_order_processed: transaction.is_shipping_order_processed,

      captured_items: transaction.captured_items,
      items: transaction.items,
      refunded_items: transaction.refunded_items,

      merchant_email: transaction.merchant_email,
      merchant_name: transaction.merchant_name,
      payment_details: { },
      payment_fee: transaction.payment_fee,
      payment_flow_id: transaction.payment_flow_id,
      payment_issuer: transaction.payment_issuer,
      place: transaction.place,
      pos_merchant_mode: transaction.pos_merchant_mode,
      pos_verify_type: transaction.pos_verify_type,
      reference: transaction.reference,
      santander_applications: transaction.santander_applications,
      shipping_address: transaction.shipping_address,
      shipping_category: transaction.shipping_category,
      shipping_method_name: transaction.shipping_method_name,
      shipping_option_name: transaction.shipping_option_name,
      shipping_order_id: transaction.shipping_order_id,
      specific_status: transaction.specific_status,
      status: transaction.status,
      status_color: transaction.status_color,
      store_id: transaction.store_id,
      store_name: transaction.store_name,
      total: transaction.total,
      total_left: transaction.total_left,
      type: transaction.type,
      updated_at: transaction.updated_at,
      user_uuid: transaction.user_uuid,

      delivery_fee_canceled: transaction.delivery_fee_canceled,
      delivery_fee_captured: transaction.delivery_fee_captured,
      delivery_fee_left: transaction.delivery_fee_left,
      delivery_fee_refunded: transaction.delivery_fee_refunded,

      example: transaction.example,
      example_shipping_label: transaction.example_shipping_label,
      example_shipping_slip: transaction.example_shipping_slip,

      anonymized: transaction.anonymized,
    };

    try {
      unpacked.payment_details =
        transaction.payment_details
        ? JSON.parse(transaction.payment_details)
        : { }
      ;
    } catch (e) {
      /** just skipping payment_details */
      Logger.log({
        context: 'TransactionService',
        error: e.message,
        message: 'Error during unpack of payment details',
        transaction: transaction,
      });
    }

    return unpacked;
  }
}
