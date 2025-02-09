import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  PaymentNotificationStatusesEnum,
  MessageBusRoutingKeys,
} from '../enums';
import { DeliveryAttemptService, NotificationSender, NotificationService } from '../services';
import { NotificationModel } from '../models';
import { environment } from '../../environments';

@Controller()
export class NotificationBusMessageController {
  constructor(
    private readonly deliveryAttemptService: DeliveryAttemptService,
    private readonly notificationSender: NotificationSender,
    private readonly notificationService: NotificationService,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    channel: environment.rabbitPaymentNotificationQueueName,
    name: '',
    routingKey: MessageBusRoutingKeys.paymentNotificationsRoutingKey1,
  })
  public async onNotificationSendEvent(data: { notificationId: string}): Promise<void> {
    const notificationModel: NotificationModel = await this.notificationService.getNotification(
      data.notificationId,
    );
    if (!notificationModel) {
      this.logger.warn(`Notification #${data.notificationId} was not found`);

      return;
    }

    if (notificationModel.status !== PaymentNotificationStatusesEnum.STATUS_PROCESSING) {
      this.logger.warn(`Notification #${data.notificationId} is not in status PROCESSING`);

      return;
    }
    await this.notificationSender.sendPaymentNotification(notificationModel);
  }

}
