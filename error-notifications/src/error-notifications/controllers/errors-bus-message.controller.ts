import { Controller } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { MessagePattern } from '@nestjs/microservices';
import { MessageBusChannelsEnum, MessageBusEventsEnum, ErrorNotificationTypesEnum } from '../enums';
import {
  ErrorNotificationEventDto,
  PaymentNotificationFailedEventDto,
} from '../dto';
import { ErrorNotificationService } from '../services';
import { validate, ValidationError } from 'class-validator';

@Controller()
export class ErrorsBusMessageController {
  constructor(
    private readonly errorNotificationService: ErrorNotificationService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.errorNotifications,
    name: MessageBusEventsEnum.paymentNotificationFailed,
  })
  public async onPaymentNotificationFailedEvent(
    data: any,
  ): Promise<void> {
    const paymentNotification: PaymentNotificationFailedEventDto =
      plainToClass<PaymentNotificationFailedEventDto, any>(PaymentNotificationFailedEventDto, data);

    const validationErrors: ValidationError[] =
      await validate(paymentNotification);

    if (!(validationErrors && validationErrors.length)) {
      const eventDto: ErrorNotificationEventDto = {
        businessId: paymentNotification.businessId,
        errorDate: paymentNotification.firstFailure,
        errorDetails: {
          deliveryAttempts: paymentNotification.deliveryAttempts,
          firstFailure: paymentNotification.firstFailure,
          noticeUrl: paymentNotification.noticeUrl,
          paymentId: paymentNotification.paymentId,
          statusCode: paymentNotification.statusCode,
        },
        type: ErrorNotificationTypesEnum.paymentNotificationFailed,
      };
      await this.errorNotificationService.createNotificationError(eventDto);
    }
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.errorNotifications,
    name: MessageBusEventsEnum.apiKeysInvalid,
  })
  public async onApiKeysInvalidEvent(data: any): Promise<void> {
    const errorNotification: ErrorNotificationEventDto = plainToClass(ErrorNotificationEventDto, data);

    errorNotification.type = ErrorNotificationTypesEnum.apiKeysInvalid;
    errorNotification.errorDate = new Date();
    await this.errorNotificationService.createNotificationError(errorNotification);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.errorNotifications,
    name: MessageBusEventsEnum.thirdPartyError,
  })
  public async onThirdPartyError(data: any): Promise<void> {
    const errorNotification: ErrorNotificationEventDto = plainToClass(ErrorNotificationEventDto, data);

    errorNotification.type = ErrorNotificationTypesEnum.thirdPartyError;
    errorNotification.errorDate = new Date();
    await this.errorNotificationService.createNotificationError(errorNotification);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.errorNotifications,
    name: MessageBusEventsEnum.paymentOptionCredentialsInvalid,
  })
  public async onPaymentOptionCredentialsInvalidEvent(data: any): Promise<void> {
    const errorNotification: ErrorNotificationEventDto = plainToClass(ErrorNotificationEventDto, data);

    errorNotification.type = ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid;
    errorNotification.errorDate = new Date();
    await this.errorNotificationService.createNotificationError(errorNotification);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.errorNotifications,
    name: MessageBusEventsEnum.pspApiFailed,
  })
  public async onPspApiFailedEvent(data: any): Promise<void> {
    const errorNotification: ErrorNotificationEventDto = plainToClass(ErrorNotificationEventDto, data);

    errorNotification.type = ErrorNotificationTypesEnum.pspApiFailed;
    errorNotification.errorDate = new Date();
    await this.errorNotificationService.createNotificationError(errorNotification);
  }
}
