import { plainToClass } from 'class-transformer';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { MessageBusEventsEnum, MessageBusChannelsEnum, ErrorNotificationTypesEnum } from '../enums';
import { PaymentEventDto, ErrorNotificationEventDto, PaymentEventRemovedDto } from '../dto';
import { ErrorNotificationService, TransactionsService } from '../services';

@Controller()
export class PaymentBusMessageController {
  constructor(
    private readonly errorNotificationService: ErrorNotificationService,
    private readonly transactionsService: TransactionsService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.errorNotifications,
    name: MessageBusEventsEnum.PaymentSubmitted,
  })
  public async onPaymentSubmittedEvent(data: { payment: any}): Promise<void> {
    const payment: PaymentEventDto = plainToClass(PaymentEventDto, data.payment);

    const eventDto: ErrorNotificationEventDto = {
      businessId: payment.business.id,
      errorDate: payment.created_at,
      errorDetails: { },
      integration: payment.payment_type,
      type: ErrorNotificationTypesEnum.lastTransactionTime,
    };

    await this.errorNotificationService.createNotificationError(eventDto);
    await this.transactionsService.createOrUpdateFromEventDto(payment);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.errorNotifications,
    name: MessageBusEventsEnum.PaymentUpdated,
  })
  public async onPaymentUpdatedEvent(data: { payment: any}): Promise<void> {
    const payment: PaymentEventDto = plainToClass(PaymentEventDto, data.payment);
    await this.transactionsService.createOrUpdateFromEventDto(payment);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.errorNotifications,
    name: MessageBusEventsEnum.PaymentRemoved,
  })
  public async onPaymentRemovedEvent(data: { payment: any}): Promise<void> {
    const payment: PaymentEventRemovedDto = plainToClass(PaymentEventRemovedDto, data.payment);

    await this.transactionsService.removeById(payment.uuid);
  }

}
