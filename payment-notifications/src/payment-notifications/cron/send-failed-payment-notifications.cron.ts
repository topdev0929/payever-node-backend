import { Injectable, Logger } from '@nestjs/common';
import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import * as cron from 'node-cron';
import { NotificationService, RabbitMqService } from '../services';
import { NotificationModel } from '../models';
import { environment } from '../../environments';
import { MessageBusExchangesEnum, PaymentEventTypesEnum, MessageBusRoutingKeys } from '../enums';

@Injectable()
export class SendFailedPaymentNotificationsCron extends Server implements CustomTransportStrategy {
  constructor(
    protected readonly logger: Logger,
    private readonly notificationService: NotificationService,
    private readonly rabbitmqService: RabbitMqService,
  ) {
    super();
  }

  public async listen(callback: () => void): Promise<void> {
    await cron.schedule('5 3 * * *', () => this.sendFailedPaymentsNotifications());
    this.logger.log('Payments notifications cron: Configured cron schedule for failed payments notifications sending');

    callback();
  }

  public async close(): Promise<void> {
    return null;
  }

  public async sendFailedPaymentsNotifications(): Promise<void> {
    this.logger.log('Payments notifications cron: Starting failed notifications processing...');

    try {
      const startDate: Date = new Date();
      startDate.setUTCDate(startDate.getUTCDate() - 7);

      const notifications: NotificationModel[] = await this.notificationService.getFailedNotifications(
        startDate,
        new Date(),
        environment.notificationMaxAttempts,
      );

      this.logger.log(`Payments notifications cron: Found ${notifications.length} notifications`);

      notifications.sort((first: NotificationModel, second: NotificationModel): number => {
        return first.notificationType === PaymentEventTypesEnum.TYPE_PAYMENT_CREATED
          ? -1
          : (second.notificationType === PaymentEventTypesEnum.TYPE_PAYMENT_CREATED ? 1 : 0);
      });

      for (const notificationModel of notifications) {
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
