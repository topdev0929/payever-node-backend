import { Injectable } from '@nestjs/common';
import { CheckoutTransactionHistoryItemInterface } from '../interfaces/checkout';
import { HistoryEventDataInterface } from '../interfaces/history-event-message';
import { TransactionHistoryEntryInterface } from '../interfaces/transaction';
import { TransactionModel } from '../models';

@Injectable()
export class TransactionHistoryEntryConverter {

  public static fromHistoryActionCompletedMessage(
    transaction: TransactionModel,
    type: string,
    createdAt: Date,
    data: HistoryEventDataInterface,
  ): TransactionHistoryEntryInterface {
    const item: TransactionHistoryEntryInterface = {
      action: type,
      amount: data.amount,
      created_at: createdAt,
      currency: transaction.currency,
      delivery_fee: data.delivery_fee,
      payment_status: data.payment_status,
      reason: data.reason,
      reference: data.reference,

      items: data.items,

      business_id: transaction.business_uuid,
      error: data.error,
      idempotency_key: data.idempotency_key,
      is_external_api_call: data.is_external_api_call,
      request_data: data.request_data,
      status: data.status,
      transaction_id: transaction.uuid,
    };

    if (data.mail_event) {
      item.mail_event = data.mail_event;
    }

    if (data.user) {
      item.user = data.user;
    }

    if (data.psp_status) {
      item.psp_status = data.psp_status;
    }

    if (data.requirements_state) {
      item.requirements_state = data.requirements_state;
    }

    return item;
  }

  public static fromCheckoutTransactionHistoryItem(
    type: string,
    createdAt: Date,
    data: CheckoutTransactionHistoryItemInterface,
  ): TransactionHistoryEntryInterface {
    const item: TransactionHistoryEntryInterface = {
      action: type,
      amount: data.amount,
      created_at: createdAt,
      payment_status: data.payment_status,
      reason: data.reason,
    };

    if (data.params) {
      item.params = Array.isArray(data.params)
        ? { }
        : data.params
      ;
    }

    return item;
  }
}
