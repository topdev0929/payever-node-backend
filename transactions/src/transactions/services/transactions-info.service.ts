import { Injectable } from '@nestjs/common';
import { TransactionOutputConverter, TransactionPaymentDetailsConverter } from '../converter';
import { TransactionOutputInterface, TransactionUnpackedDetailsInterface, ActionItemInterface } from '../interfaces';
import { TransactionModel } from '../models';
import { ActionsRetriever, TransactionHistoryService } from '../services';
import { TransactionsNotifier } from '../notifiers';


@Injectable()
export class TransactionsInfoService {
  constructor(
    private readonly actionsRetriever: ActionsRetriever,
    private readonly transactionsNotifier: TransactionsNotifier,
    private readonly transactionHistoryService: TransactionHistoryService,
  ) { }

  public async getFullDetails(transaction: TransactionModel): Promise<TransactionOutputInterface>  {
    await this.transactionHistoryService.prepareTransactionHistory(transaction);

    const unpackedTransaction: TransactionUnpackedDetailsInterface = TransactionPaymentDetailsConverter.convert(
      transaction.toObject({ virtuals: true }),
    );

    await this.transactionsNotifier.cancelNewTransactionNotification(transaction);

    return TransactionOutputConverter.convert(
      unpackedTransaction,
      !transaction.example
        ? await this.actionsRetriever.retrieve(unpackedTransaction)
        : this.actionsRetriever.retrieveFakeActions(unpackedTransaction)
      ,
    );
  }

  public async getDetails(transaction: TransactionModel): Promise<TransactionOutputInterface> {
    await this.transactionHistoryService.prepareTransactionHistory(transaction);

    const unpackedTransaction: TransactionUnpackedDetailsInterface = TransactionPaymentDetailsConverter.convert(
      transaction.toObject({ virtuals: true }),
    );

    return TransactionOutputConverter.convert(unpackedTransaction);
  }

  public async getActionList(transaction: TransactionModel): Promise<ActionItemInterface[]> {
    const unpackedTransaction: TransactionUnpackedDetailsInterface = TransactionPaymentDetailsConverter.convert(
      transaction.toObject({ virtuals: true }),
    );

    return !transaction.example ? this.actionsRetriever.retrieve(unpackedTransaction)
      : this.actionsRetriever.retrieveFakeActions(unpackedTransaction);
  }
}
