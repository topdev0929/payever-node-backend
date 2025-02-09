import { Injectable, Logger } from '@nestjs/common';
import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import * as cron from 'node-cron';
import { NotificationService, RabbitMqService } from '../services';
import { NotificationModel } from '../models';
import { environment } from '../../environments';
import {
  MessageBusExchangesEnum,
  PaymentEventTypesEnum,
  PaymentNotificationStatusesEnum,
  MessageBusRoutingKeys,
} from '../enums';

@Injectable()
export class SendRegularPaymentsNotificationsCron extends Server implements CustomTransportStrategy {
  constructor(
    protected readonly logger: Logger,
    private readonly notificationService: NotificationService,
    private readonly rabbitmqService: RabbitMqService,
  ) {
    super();
  }

  public async listen(callback: () => void): Promise<void> {
    // every 5 minutes we add to queue notifications that previously failed
    await cron.schedule('*/5 * * * *', () => this.sendPaymentsNotifications(
      PaymentNotificationStatusesEnum.STATUS_FAILED,
    ));

    this.logger.log('Payments notifications cron: Configured cron schedule for payments notifications send');

    callback();
  }

  public async close(): Promise<void> {
    return null;
  }

  public async sendPaymentsNotifications(status: PaymentNotificationStatusesEnum): Promise<void> {
    this.logger.log(`Payments notifications cron: Starting cron notifications for status "${status}"`);

    try {
      const startDate: Date = new Date();
      startDate.setUTCDate(startDate.getUTCDate() - 30);

      const notifications: NotificationModel[] = await this.notificationService.getNotificationsDeliveryReady(
        startDate,
        new Date(),
        status,
        environment.notificationMaxAttempts,
      );

      this.logger.log(`Payments notifications cron: Found ${notifications.length} notifications`);

      notifications.sort((first: NotificationModel, second: NotificationModel): number => {
        return first.notificationType === PaymentEventTypesEnum.TYPE_PAYMENT_CREATED
          ? -1
          : (second.notificationType === PaymentEventTypesEnum.TYPE_PAYMENT_CREATED ? 1 : 0);
      });

      const inQueuePaymentNotifications: string[] = [];

      for (const notificationModel of notifications) {
        if (inQueuePaymentNotifications.includes(notificationModel.paymentId)) {
          continue;
        }

        await this.notificationService.markNotificationAsProcessing(notificationModel);
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

        inQueuePaymentNotifications.push(notificationModel.paymentId);
      }
    } catch (error) {
      this.logger.warn({
        error: error.message,
        message: 'Payments notifications cron: Failed to add notifications to queue',
      });
    }
  }
}
