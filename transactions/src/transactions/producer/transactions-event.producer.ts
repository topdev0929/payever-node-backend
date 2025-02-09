import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { plainToClass } from 'class-transformer';
import { RabbitRoutingKeys } from '../../enums';
import {
  TransactionExportBusinessDto,
  TransactionExportChannelSetDto,
  TransactionExportDto,
} from '../dto';
import {
  MonthlyBusinessTransactionInterface,
  TransactionPackedDetailsInterface,
  TransactionUnpackedDetailsInterface,
  UserPerBusinessTransactionInPeriodInterface,
} from '../interfaces';
import { HistoryEventActionCompletedInterface } from '../interfaces/history-event-message';
import { TransactionPaymentInterface } from '../interfaces/transaction';
import { TransactionModel } from '../models';
import { TransactionPaymentDetailsConverter } from '../converter';
import { TransactionPaymentDto } from '../dto/checkout-rabbit';
import { CheckoutTransactionHistoryItemInterface } from '../interfaces/checkout';

@Injectable()
export class TransactionEventProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async produceTransactionPaidEvent(
    transaction: TransactionPackedDetailsInterface,
    amount: number,
    last_updated: Date,
  ): Promise<void> {
    await this.produceTransactionUpdateEvent(
      transaction, amount, RabbitRoutingKeys.TransactionsPaymentPaid, last_updated);
  }

  public async produceTransactionRefundEvent(
    transaction: TransactionPackedDetailsInterface,
    amount: number,
    last_updated: Date,
  ): Promise<void> {

    await this.produceTransactionUpdateEvent(
      transaction, amount, RabbitRoutingKeys.TransactionsPaymentRefund, last_updated);
  }

  public async produceTransactionRefundEventPayload(
    payload: TransactionPaymentDto,
  ): Promise<void> {

    await this.send(RabbitRoutingKeys.TransactionsPaymentRefund, payload);
  }

  /** @deprecated */
  public async produceTransactionAddEvent(
    transaction: TransactionPackedDetailsInterface,
    amount: number,
  ): Promise<void> {

    await this.produceTransactionUpdateEvent(
      transaction, amount, RabbitRoutingKeys.TransactionsPaymentAdd, null);
  }

  /** @deprecated */
  public async produceTransactionSubtractEvent(
    transaction: TransactionModel,
    refund: HistoryEventActionCompletedInterface,
  ): Promise<void> {
    await this.produceTransactionUpdateEvent(
      transaction, refund.data.amount, RabbitRoutingKeys.TransactionsPaymentSubtract, null);
  }

  public async produceTransactionRemoveEvent(transaction: TransactionModel): Promise<void> {
    await this.produceTransactionUpdateEvent(
      transaction, transaction.amount, RabbitRoutingKeys.TransactionsPaymentRemoved, null);
  }

  public async produceExportMonthlyBusinessTransactionEvent(
    transactions: MonthlyBusinessTransactionInterface[],
  ): Promise<void> {
    for (const transaction of transactions) {
      await this.send(RabbitRoutingKeys.ExportMonthlyBusinessTransaction, transaction);
    }
  }

  public async produceExportMonthlyUserPerBusinessTransactionEvent(
    items: UserPerBusinessTransactionInPeriodInterface[],
  ): Promise<void> {
    for (const item of items) {
      await this.send(RabbitRoutingKeys.ExportMonthlyUserPerBusinessTransaction, item);
    }
  }

  public async produceExportTotalUserPerBusinessTransactionEvent(
    data: UserPerBusinessTransactionInPeriodInterface[],
  ): Promise<void> {
    for (const item of data) {
      await this.send(RabbitRoutingKeys.ExportTotalUserPerBusinessTransaction, item);
    }
  }

  public async produceTransactionBlankMigrateEvent(
    transactionModel: TransactionModel,
  ): Promise<void> {
    if (!transactionModel.original_id) {
      transactionModel.original_id = transactionModel.uuid;
    }

    const unpackedTransaction: TransactionUnpackedDetailsInterface =
      TransactionPaymentDetailsConverter.convert(transactionModel.toObject({ virtuals: true }));

    const transactionExportDto: TransactionExportDto =
      plainToClass<TransactionExportDto, TransactionUnpackedDetailsInterface>(
        TransactionExportDto,
        unpackedTransaction,
      );

    transactionExportDto.payment_details = unpackedTransaction.payment_details;

    transactionExportDto.business =
      plainToClass<TransactionExportBusinessDto, TransactionPackedDetailsInterface>(
        TransactionExportBusinessDto,
        transactionModel.toObject() as TransactionPackedDetailsInterface,
      );

    transactionExportDto.channel_set =
      plainToClass<TransactionExportChannelSetDto, TransactionPackedDetailsInterface>(
        TransactionExportChannelSetDto,
        transactionModel.toObject() as TransactionPackedDetailsInterface,
      );

    await this.send(RabbitRoutingKeys.TransactionsMigrate, { payment: transactionExportDto });
  }

  public async produceInternalTransactionRefundEvent(
    transaction: TransactionPackedDetailsInterface,
    last_updated: Date,
    history: CheckoutTransactionHistoryItemInterface[],
  ): Promise<void> {

    await this.produceTransactionUpdateEvent(
      transaction, null, RabbitRoutingKeys.InternalTransactionPaymentRefund, last_updated, history);
  }

  public async produceTransactionExportEvent(
    transaction: TransactionPackedDetailsInterface,
  ): Promise<void> {

    const payload: any = {
      amount: transaction.amount,
      business: {
        id: transaction.business_uuid,
      },
      channel: transaction.channel,
      channel_set: {
        id: transaction.channel_set_uuid,
      },
      customer: {
        email: transaction.customer_email,
        name: transaction.customer_name,
      },
      date: transaction.updated_at,
      id: transaction.uuid,
      items: transaction.items,
      reference: transaction.reference,
      user: {
        id: transaction.user_uuid,
      },
    };

    await this.send(RabbitRoutingKeys.TransactionsPaymentExport, payload);
  }

  private async send(eventName: string, payload: any): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload: payload,
      },
    );
  }

  private async produceTransactionUpdateEvent(
    transaction: TransactionPackedDetailsInterface,
    amount: number,
    event: RabbitRoutingKeys,
    last_updated: Date,
    history?: CheckoutTransactionHistoryItemInterface[],
  ): Promise<void> {

    const payload: TransactionPaymentInterface = {
      amount: amount,
      business: {
        id: transaction.business_uuid,
      },
      channel_set: {
        id: transaction.channel_set_uuid,
      },
      customer: {
        email: transaction.customer_email,
        name: transaction.customer_name,
      },
      date: transaction.updated_at,
      history: history,
      id: transaction.uuid,
      items: transaction.items,
      last_updated: last_updated,
      user: {
        id: transaction.user_uuid,
      },
    };

    await this.send(event, payload);
  }

}
