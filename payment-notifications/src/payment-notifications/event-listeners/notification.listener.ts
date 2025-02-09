import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import {
  MessageBusEventsEnum,
  MessageBusExchangesEnum,
  NotificationEventEnum,
  PaymentNotificationStatusesEnum,
} from '../enums';
import { DeliveryAttemptModel, NotificationModel } from '../models';
import { RabbitMqService, TelegramMessenger } from '../services';
import { environment } from '../../environments';
import { NotificationFailedDto } from '../dto';
import { PaymentNotificationTransformer } from '../transformers';

@Injectable()
export class NotificationListener {
  constructor(
    private readonly telegramMessenger: TelegramMessenger,
    private readonly rabbitmqService: RabbitMqService,
  ) { }

  @EventListener(NotificationEventEnum.notificationSent)
  public async sendMessageToTelegramOnNotificationFailed(
    notificationModel: NotificationModel,
    deliveryAttemptModel: DeliveryAttemptModel,
  ): Promise<void> {
    if (deliveryAttemptModel.status !== PaymentNotificationStatusesEnum.STATUS_FAILED
      || notificationModel.retriesNumber < environment.notificationMaxAttempts
    ) {
      return;
    }

    const message: string = TelegramMessenger.createNotificationAlertMessage(notificationModel, deliveryAttemptModel);

    await this.telegramMessenger.sendNotificationAlert(message);
  }

  @EventListener(NotificationEventEnum.notificationSent)
  public async sendRabbitEventOnNotificationFailed(
    notificationModel: NotificationModel,
    deliveryAttemptModel: DeliveryAttemptModel,
  ): Promise<void> {
    if (deliveryAttemptModel.status !== PaymentNotificationStatusesEnum.STATUS_FAILED
      || notificationModel.retriesNumber < environment.notificationMaxAttempts
      || deliveryAttemptModel.responseStatusCode < 500
    ) {
      return;
    }

    await notificationModel.populate('deliveryAttempts').execPopulate();

    const notificationFailedDto: NotificationFailedDto =
      PaymentNotificationTransformer.paymentNotificationToFailedMessage(
        notificationModel,
        deliveryAttemptModel.responseStatusCode,
      );

    await this.rabbitmqService.sendEvent(
      MessageBusExchangesEnum.asyncEvents,
      MessageBusEventsEnum.paymentNotificationFailed,
      notificationFailedDto,
    );
  }
}
