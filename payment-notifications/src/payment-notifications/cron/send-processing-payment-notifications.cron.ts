import { Injectable, Logger } from '@nestjs/common';
import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import * as cron from 'node-cron';
import { NotificationService, RabbitMqService } from '../services';
import { NotificationModel } from '../models';
import { MessageBusExchangesEnum, MessageBusRoutingKeys } from '../enums';
import * as dateFns from 'date-fns';

@Injectable()
export class SendProcessingPaymentNotificationsCron extends Server implements CustomTransportStrategy {
  constructor(
    protected readonly logger: Logger,
    private readonly notificationService: NotificationService,
    private readonly rabbitmqService: RabbitMqService,
  ) {
    super();
  }

  public async listen(callback: () => void): Promise<void> {
    await cron.schedule('*/2 * * * *', () => this.sendProcessingPaymentsNotifications());
    this.logger.log(
      'Payments notifications cron: Configured cron schedule for payments notifications with status processing',
    );

    callback();
  }

  public async close(): Promise<void> {
    return null;
  }

  public async sendProcessingPaymentsNotifications(): Promise<void> {
    this.logger.log('Payments notifications cron: Starting sending notifications with status processing...');

    try {
      const endDate: Date = dateFns.addMinutes(new Date(), -5);

      const notifications: NotificationModel[] = await this.notificationService.getProcessingNotifications(endDate);

      this.logger.log(`Payments notifications cron: Found ${notifications.length} notifications`);

      for (const notificationModel of notifications) {
        await this.rabbitmqService.sendEvent(
          MessageBusExchangesEnum.paymentNotificationsSend,
          MessageBusRoutingKeys.paymentNotificationsRoutingKey1,
          {
            notificationId: notificationModel.id,
          },
          {
            headers: {
              'hash-on': notificationModel.paymentId,
            },
          },
        );

        this.logger.log({
          message: `Payments notifications cron: Added notification ${notificationModel.id} to queue`,
        });
      }
    } catch (error) {
      this.logger.warn({
        error: error.message,
        message: 'Payments notifications cron: Failed to execute notifications send',
      });

      throw error;
    }
  }
}
