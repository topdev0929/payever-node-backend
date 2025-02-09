import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitRoutingKeys, RabbitChannels } from '../../enums';
import { AtomDateConverter, TransactionConverter, TransactionHistoryEntryConverter } from '../converter';
import { CheckoutTransactionInterface } from '../interfaces/checkout';
import { TransactionHistoryEntryInterface, TransactionPackedDetailsInterface } from '../interfaces';
import { HistoryCommonModel, TransactionModel } from '../models';
import { StatisticsService, TransactionsService } from '../services';

@Controller()
export class MigrateEventsConsumer {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly statisticsService: StatisticsService,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    channel: RabbitChannels.Transactions,
    name: RabbitRoutingKeys.PaymentMigrate,
  })
  public async onActionMigrateEvent(data: any): Promise<void> {
    this.logger.log('ACTION.MIGRATE!', data.payment);
    const checkoutTransaction: CheckoutTransactionInterface = data.payment;
    const transaction: TransactionPackedDetailsInterface =
      TransactionConverter.fromCheckoutTransaction(checkoutTransaction);
    const oldTransaction: TransactionModel = await this.transactionsService.findModelByUuid(transaction.uuid);

    const created: TransactionModel = await this.createOrUpdate(transaction);

    const updateHistory: boolean = !oldTransaction?.history?.length && !oldTransaction?.historyIds?.length;
    const history: HistoryCommonModel[] = [];

    if (updateHistory && checkoutTransaction.history && checkoutTransaction.history.length) {
      for (const historyItem of checkoutTransaction.history) {
        const record: TransactionHistoryEntryInterface =
          TransactionHistoryEntryConverter.fromCheckoutTransactionHistoryItem(
            historyItem.action,
            (
              historyItem.created_at && AtomDateConverter.fromAtomFormatToDate(historyItem.created_at)
            ) || new Date(),
            historyItem,
          );

        history.push(
          created.history.create(record),
        );
      }

      const createdWithHistory: TransactionModel =
        await this.transactionsService.updateHistoryByUuid(created.uuid, history);

      await this.statisticsService.processMigratedTransaction(createdWithHistory);
    }
    
    this.logger.log('TRANSACTION MIGRATE COMPLETED');
  }

  private async createOrUpdate(transaction: TransactionPackedDetailsInterface): Promise<TransactionModel> {
    if (await this.transactionsService.findModelByUuid(transaction.uuid)) {
      return this.transactionsService.updateByUuid(transaction.uuid, transaction);
    }

    return this.transactionsService.create(transaction);
  }
}
