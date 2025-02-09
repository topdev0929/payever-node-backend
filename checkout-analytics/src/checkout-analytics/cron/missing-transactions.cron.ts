import { Injectable, Logger } from '@nestjs/common';
import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import * as cron from 'node-cron';
import * as moment from 'moment';
import { PaymentService, TelegramMessenger } from '../services';
import { PaymentModel } from '../models';
import { DATE_FORMAT } from '../constants';

@Injectable()
export class MissingTransactionsCron extends Server implements CustomTransportStrategy {
  constructor(
    protected readonly logger: Logger,
    private readonly paymentService: PaymentService,
    private readonly telegramMessenger: TelegramMessenger,
  ) {
    super();
  }

  public async listen(callback: () => void): Promise<void> {
    await cron.schedule('*/5 0,5-23 * * 1-5', () => this.checkMissingTransactionsWorkday());
    await cron.schedule('*/15 0,5-23 * * 0,6', () => this.checkMissingTransactionsWeekend());
    await cron.schedule('*/30 1-5 * * *', () => this.checkMissingTransactionsNight());
    this.logger.log('Checkout analytics cron: Configured cron schedule for missing transactions check');

    callback();
  }

  public async close(): Promise<void> {
    return null;
  }

  public async checkMissingTransactionsWorkday(): Promise<void> {
    await this.checkMissingTransactions(moment().subtract(5, 'minutes').toDate());
  }

  public async checkMissingTransactionsWeekend(): Promise<void> {
    await this.checkMissingTransactions(moment().subtract(15, 'minutes').toDate());
  }

  public async checkMissingTransactionsNight(): Promise<void> {
    await this.checkMissingTransactions(moment().subtract(30, 'minutes').toDate());
  }

  private async checkMissingTransactions(from: Date): Promise<void> {
    this.logger.log('Checkout analytics cron: Starting missing transactions check...');

    const to: Date = new Date();
    from.setSeconds(0);
    from.setMilliseconds(0);
    to.setSeconds(0);
    to.setMilliseconds(0);
    const previousFrom: Date = moment(from).subtract(moment.duration(moment(to).diff(from))).toDate();

    const currentPeriodTransactions: PaymentModel[] =
      await this.paymentService.findTransactionsByCreatedAtRange(from, to);
    const previousPeriodTransactions: PaymentModel[] =
      await this.paymentService.findTransactionsByCreatedAtRange(previousFrom, from);

    this.logger.log(`Checkout analytics missing transactions cron: ` +
      `Found ${currentPeriodTransactions.length} transactions for current period ` +
      `from ${moment(from).format(DATE_FORMAT)} ` +
      `to ${moment(to).format(DATE_FORMAT)}`,
    );

    this.logger.log(`Checkout analytics missing transactions cron: ` +
      `Found ${currentPeriodTransactions.length} transactions for previous period ` +
      `from ${moment(previousFrom).format(DATE_FORMAT)} ` +
      `to ${moment(from).format(DATE_FORMAT)}`,
    );

    if (currentPeriodTransactions.length === 0) {
      await this.telegramMessenger.sendMissingTransactionsAlert(
        TelegramMessenger.prepareTelegramMissingTransactionsErrorNotification(from, to),
      );

      return;
    }

    if (previousPeriodTransactions.length === 0) {
      await this.telegramMessenger.sendMissingTransactionsAlert(
        TelegramMessenger.prepareTelegramMissingTransactionsNewNotification(currentPeriodTransactions[0].createdAt),
      );
    }
  }
}
