import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  MessageBusChannelsEnum,
  MessageBusEventsEnum,
  PaymentEventTypesEnum,
  MessageBusExchangesEnum,
  MessageBusRoutingKeys,
} from '../enums';
import { PaymentStatusesEnum, PaymentActionsEnum } from '@pe/payments-sdk';
import { ApiCallService, NotificationService, RabbitMqService } from '../services';
import { NotificationModel } from '../models';
import { PaymentEventDto } from '../dto';

@Controller()
export class PaymentBusMessageController {
  constructor(
    private readonly apiCallService: ApiCallService,
    private readonly notificationService: NotificationService,
    private readonly rabbitmqService: RabbitMqService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.paymentNotifications,
    name: MessageBusEventsEnum.paymentCreated,
  })
  public async onPaymentCreatedEvent(data: PaymentEventDto): Promise<void> {
    await this.onPaymentMessageCreatedOrUpdated(data, PaymentEventTypesEnum.TYPE_PAYMENT_CREATED);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.paymentNotifications,
    name: MessageBusEventsEnum.forceCreateNotification,
  })
  public async onForceCreateNotificationEvent(
    data: PaymentEventDto,
  ): Promise<void> {
    if (data.payment.status === PaymentStatusesEnum.STATUS_NEW) {
      return;
    }
    if (data.payment_event === PaymentEventTypesEnum.TYPE_PAYMENT_CHANGED_FAILED
      && data.payment.channel === 'commercetools'
    ) {
      return;
    }

    if (data.action && data.amount) {
      switch (data.action) {
        case PaymentActionsEnum.actionShippingGoods:
          data.payment.capture_amount = data.amount;
          break;
        case PaymentActionsEnum.actionRefund:
          data.payment.refund_amount = data.amount;
          break;
        case PaymentActionsEnum.actionCancel:
          data.payment.cancel_amount = data.amount;
          break;
      }
    }

    const paymentEvent: PaymentEventTypesEnum = data.payment_event
      ? data.payment_event
      : PaymentEventTypesEnum.TYPE_PAYMENT_CHANGED;

    await this.onPaymentMessageCreatedOrUpdated(data, paymentEvent);
  }

  private async onPaymentMessageCreatedOrUpdated(
    data: PaymentEventDto,
    paymentEventType: PaymentEventTypesEnum,
  ): Promise<void> {
    await this.apiCallService.applyPaymentId(data.payment.api_call_id, data.payment.id);

    const notificationModel: NotificationModel =
      await this.notificationService.createPaymentNotificationFromPaymentEvent(data, paymentEventType);

    if (!notificationModel) {
      return;
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
  }
}
