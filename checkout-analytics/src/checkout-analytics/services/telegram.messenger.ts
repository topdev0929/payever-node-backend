import { Injectable, Logger } from '@nestjs/common';
import { TelegramService } from 'nestjs-telegram';
import * as moment from 'moment';

import { DATE_FORMAT } from '../constants';
import { environment } from '../../environments';

@Injectable()
export class TelegramMessenger {
  constructor(
    private readonly telegram: TelegramService,
    private readonly logger: Logger,
  ) { }

  public async sendMissingTransactionsAlert(message: string): Promise<void> {
    await this.send(environment.telegramChatMissingTransactionsAlerts, message);
  }

  public static prepareTelegramLastTransactionTimeErrorNotification(
    paymentMethod: string,
    lastTransactionDate: Date,
  ): string {

    return `⚠️ <b>${paymentMethod}</b> ` +
      `from ${moment(lastTransactionDate).format(DATE_FORMAT)} ` +
      `(<b>${moment(lastTransactionDate).fromNow()}</b>)`;
  }

  public static prepareTelegramLastTransactionTimeNewNotification(
    paymentMethod: string,
    lastTransactionDate: Date,
    previousTransactionDate: Date,
  ): string {

    return `✅ <b>${paymentMethod}</b> ` +
      `from ${moment(lastTransactionDate).format(DATE_FORMAT)} ` +
      `(<b>${moment(lastTransactionDate).fromNow()}</b>) ` +
      `after <b>${moment(previousTransactionDate).from(lastTransactionDate, true)}</b> without transactions`;
  }

  public static prepareTelegramMissingTransactionsErrorNotification(
    from: Date,
    to: Date,
  ): string {

    return `⚠️ <b>No one transaction ` +
      `from ${moment(from).format(DATE_FORMAT)}</b> ` +
      `to ${moment(to).format(DATE_FORMAT)}`;
  }

  public static prepareTelegramMissingTransactionsNewNotification(
    from: Date,
  ): string {
    return `✅ <b>New transaction from ${moment(from).format(DATE_FORMAT)}</b>`;
  }

  private async send(chatId: string, message: string): Promise<void> {
    if (!chatId) {
      return;
    }

    try {
      await this.telegram.sendMessage({
        chat_id: chatId,
        parse_mode: 'html',
        text: message,
      }).toPromise();
    } catch (error) {
      this.logger.error({
        error: error,
        message: 'Telegram Notification: Failed to send message via Telegram channel',
      });
    }
  }
}
