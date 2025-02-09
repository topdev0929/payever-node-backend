import { Injectable, Logger } from '@nestjs/common';
import { environment } from '../../environments';
import { TelegramService } from 'nestjs-telegram';
import { DeliveryAttemptModel, NotificationModel } from '../models';

@Injectable()
export class TelegramMessenger {
  constructor(
    private readonly telegram: TelegramService,
    private readonly logger: Logger,
  ) { }

  public async sendNotificationAlert(message: string): Promise<void> {
    await this.send(environment.telegramChatNotificationAlerts, message);
  }

  public static createNotificationAlertMessage(
    notification: NotificationModel,
    deliveryAttempt: DeliveryAttemptModel,
  ): string {
    return `Payment Notifications: Failed sending notification\n\n` +
      `<b>Notification id:</b> ${notification.id}\n` +
      `<b>Delivery attempt id:</b> ${deliveryAttempt.id}\n` +
      `<b>Attempt number:</b> ${notification.retriesNumber}\n\n` +
      `<b>URL:</b> ${notification.url}\n\n` +
      `<b>Time:</b> ${deliveryAttempt.createdAt}\n` +
      `<b>Error message:</b> ${deliveryAttempt.exceptionMessage ? deliveryAttempt.exceptionMessage : '-'}\n`;
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
      this.logger.warn({
        error: error.message,
        message: 'Telegram Notification: Failed to send message via Telegram channel',
      });
    }
  }
}
