import { Injectable, Logger } from '@nestjs/common';
import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import * as cron from 'node-cron';

import { PaymentService, TelegramMessenger } from '../services';
import {
  PaymentMethodsAllowedInterval,
  PaymentMethodsEnum,
} from '../enums';
import { PaymentModel } from '../models';

const CHECK_INTERVAL: number = 930;

@Injectable()
export class LastTransactionTimeCron extends Server implements CustomTransportStrategy {
  constructor(
    protected readonly logger: Logger,
    private readonly paymentService: PaymentService,
    private readonly telegramMessenger: TelegramMessenger,
  ) {
    super();
  }

  public async listen(callback: () => void): Promise<void> {
    await cron.schedule('*/15 * * * *', () => this.checkLastTransactionTimeTelegram());
    this.logger.log('Checkout analytics cron: Configured cron schedule for last transaction time check');

    callback();
  }

  public async close(): Promise<void> {
    return null;
  }

  public async checkLastTransactionTimeTelegram(): Promise<void> {
    this.logger.log('Checkout analytics cron: Starting last transaction time check...');

    const now: Date = new Date();
    const nowTimestamp: number = this.dateToTimestamp(now);
    const notifications: string[] = [];
    let exceededLimitCount: number = 0;

    for (const paymentMethodsIntervals of PaymentMethodsAllowedInterval) {
      const paymentMethod: PaymentMethodsEnum = paymentMethodsIntervals[0];
      const allowedInterval: number = paymentMethodsIntervals[1];

      const transactions: PaymentModel[] =
        await this.paymentService.findLastTransactionsByPaymentMethod(paymentMethod, 2);

      if (transactions.length !== 2) {
        continue;
      }

      const lastTransaction: PaymentModel = transactions[0];
      const previousTransaction: PaymentModel = transactions[1];

      const lastTransactionTimestamp: number = this.dateToTimestamp(lastTransaction.createdAt);
      const previousTransactionTimestamp: number = this.dateToTimestamp(previousTransaction.createdAt);

      const intervalBetweenNowAndLastTransaction: number = nowTimestamp - lastTransactionTimestamp;
      const intervalBetweenLastAndPreviousTransaction: number = lastTransactionTimestamp - previousTransactionTimestamp;

      if (intervalBetweenNowAndLastTransaction >= allowedInterval) {
        notifications.push(TelegramMessenger.prepareTelegramLastTransactionTimeErrorNotification(
          paymentMethod,
          lastTransaction.createdAt,
        ));
        exceededLimitCount++;

        continue;
      }

      if (intervalBetweenLastAndPreviousTransaction <= allowedInterval) {
        continue;
      }

      if (intervalBetweenNowAndLastTransaction >= CHECK_INTERVAL) {
        continue;
      }

      notifications.push(TelegramMessenger.prepareTelegramLastTransactionTimeNewNotification(
        paymentMethod,
        lastTransaction.createdAt,
        previousTransaction.createdAt,
      ));
    }

    if (notifications.length > 0) {
      notifications.push(`Limit exceeded in <b>${exceededLimitCount}/${PaymentMethodsAllowedInterval.size}</b>`);

      await this.telegramMessenger.sendMissingTransactionsAlert(notifications.join('\n'));
    }

    this.logger.log(
      {
        message: 'Checkout analytics cron: Finished last transaction time check',
        notifications,
        sent: notifications.length,
      },
    );
  }

  private dateToTimestamp(date: Date): number {
    return parseInt((date.getTime() / 1000).toFixed(), 10);
  }
}
