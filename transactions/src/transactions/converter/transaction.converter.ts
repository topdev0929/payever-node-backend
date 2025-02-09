import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { TransactionDto } from '../dto';
import { CheckoutTransactionHistoryItemInterface, CheckoutTransactionInterface } from '../interfaces/checkout';
import {
  TransactionHistoryEntryInterface,
  TransactionPackedDetailsInterface,
  TransactionUnpackedDetailsInterface,
} from '../interfaces';
import { AtomDateConverter } from './atom.date.converter';
import { CheckoutTransactionHistoryEntryConverter } from './checkout-transaction-history-entry.converter';
import { TransactionCartConverter } from './transaction-cart.converter';
import { TransactionSantanderApplicationConverter } from './transaction-santander-application.converter';
import { CheckoutTransactionSellerInterface } from '../interfaces/checkout/checkout-transaction-seller.interface';

@Injectable()
export class TransactionConverter {

  public static fromCheckoutTransaction(
    checkoutTransaction: CheckoutTransactionInterface,
  ): TransactionPackedDetailsInterface {
    const transaction: TransactionPackedDetailsInterface =
      plainToClass<TransactionPackedDetailsInterface, CheckoutTransactionInterface>(
        TransactionDto,
        checkoutTransaction,
      );

    if (checkoutTransaction.address) {
      transaction.billing_address = checkoutTransaction.address;
    }

    transaction.type = checkoutTransaction.type || checkoutTransaction.payment_type;
    transaction.payment_issuer = checkoutTransaction.payment_issuer;

    if (checkoutTransaction.payment_details) {
      TransactionSantanderApplicationConverter.setSantanderApplication(transaction, checkoutTransaction);
      transaction.payment_details = JSON.stringify(checkoutTransaction.payment_details);
    }

    if (checkoutTransaction.business) {
      transaction.business_uuid = checkoutTransaction.business.uuid;
      transaction.merchant_name = checkoutTransaction.business.company_name;
      transaction.merchant_email = checkoutTransaction.business.company_email;
    }

    if (checkoutTransaction.payment_flow) {
      transaction.payment_flow_id = checkoutTransaction.payment_flow.id;
    }

    if (checkoutTransaction.channel_set) {
      transaction.channel_set_uuid = checkoutTransaction.channel_set.uuid;
    }

    if (checkoutTransaction.channel_set_id) {
      transaction.channel_set_uuid = checkoutTransaction.channel_set_id;
    }

    if (checkoutTransaction.items.length) {
      transaction.items = TransactionCartConverter.fromCheckoutTransactionCart(
        checkoutTransaction.items,
        transaction.business_uuid,
      );
    }

    transaction.created_at = AtomDateConverter.fromAtomFormatToDate(checkoutTransaction.created_at);
    transaction.updated_at = AtomDateConverter.fromAtomFormatToDate(checkoutTransaction.updated_at);

    if (checkoutTransaction.seller)  {
      transaction.seller_email = checkoutTransaction.seller.email;
      transaction.seller_name = TransactionConverter.getSellerName(checkoutTransaction.seller);
      transaction.seller_id = checkoutTransaction.seller.id;
    }

    /**
     * We do not update history with current operation.
     * History comes with another events and processing separately.
     */
    delete transaction.history;

    return transaction;
  }

  public static toCheckoutTransaction(
    transaction: TransactionUnpackedDetailsInterface,
  ): CheckoutTransactionInterface {
    const history: CheckoutTransactionHistoryItemInterface[] = transaction.history.map(
      (item: TransactionHistoryEntryInterface) =>
        CheckoutTransactionHistoryEntryConverter.fromTransactionHistoryItem(item),
    );

    return {
      id: transaction.original_id,
      uuid: transaction.uuid,

      address: transaction.billing_address,
      created_at: AtomDateConverter.fromDateToAtomFormat(transaction.created_at),
      updated_at: AtomDateConverter.fromDateToAtomFormat(transaction.updated_at),

      action_running: transaction.action_running,
      amount: transaction.amount,
      business_option_id: transaction.business_option_id,
      business_uuid: transaction.business_uuid,
      channel: transaction.channel,
      channel_set_id: transaction.channel_set_uuid,
      channel_set_uuid: transaction.channel_set_uuid,
      channel_uuid: transaction.channel_uuid,
      currency: transaction.currency,
      customer_email: transaction.customer_email,
      customer_name: transaction.customer_name,
      delivery_fee: transaction.delivery_fee,
      down_payment: transaction.down_payment,
      fee_accepted: transaction.fee_accepted,
      history: history,
      items: transaction.items,
      merchant_email: transaction.merchant_email,
      merchant_name: transaction.merchant_name,
      payment_details: transaction.payment_details,
      payment_fee: transaction.payment_fee,
      payment_flow_id: transaction.payment_flow_id,
      place: transaction.place,
      reference: transaction.reference || transaction.uuid,
      santander_applications: transaction.santander_applications,
      shipping_address: transaction.shipping_address,
      shipping_category: transaction.shipping_category,
      shipping_method_name: transaction.shipping_method_name,
      shipping_option_name: transaction.shipping_option_name,
      specific_status: transaction.specific_status,
      status: transaction.status,
      status_color: transaction.status_color,
      store_id: transaction.store_id,
      store_name: transaction.store_name,
      total: transaction.total,
      type: transaction.type,
      user_uuid: transaction.user_uuid,

      amount_canceled: transaction.amount_canceled,
      amount_captured: transaction.amount_captured,
      amount_invoiced: transaction.amount_invoiced,
      amount_refunded: transaction.amount_refunded,
    };
  }

  private static getSellerName(seller: CheckoutTransactionSellerInterface): string {
    let sellerName: string = seller.firstName ? seller.firstName : '';
    sellerName = seller.lastName
      ? sellerName
        ? `${sellerName} ${seller.lastName}`
        : seller.lastName
      : sellerName;

    return sellerName;
  }

}
