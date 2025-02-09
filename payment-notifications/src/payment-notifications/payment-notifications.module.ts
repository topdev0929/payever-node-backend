import { DynamicModule, Module, HttpModule, Type } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseSchemas } from './config';
import {
  ApiCallBusMessageController,
  NotificationBusMessageController,
  PaymentBusMessageController,
  NotificationController,
} from './controllers';
import {
  ApiCallService,
  NotificationService,
  RabbitMqService,
  DeliveryAttemptService,
  NotificationSender,
  NotificationSignatureGenerator,
  TelegramMessenger,
  OAuthService,
  ClientService,
} from './services';
import {
  SendFailedPaymentNotificationsCron,
  SendRegularPaymentsNotificationsCron,
  SendProcessingPaymentNotificationsCron,
} from './cron';
import { TelegramModule } from 'nestjs-telegram';
import { environment } from '../environments';
import { NotificationListener } from './event-listeners';
import { IntercomModule } from '@pe/nest-kit';
import {
  NotificationMessageSnakeCaseCommand,
  RenewProcessingNotificationsCommand,
  ResendNotificationsCommand,
} from './commands';

@Module({
  controllers: [
    ApiCallBusMessageController,
    PaymentBusMessageController,
    NotificationController,
  ],
  exports: [],
  imports: [
    HttpModule,
    IntercomModule,
    MongooseModule.forFeature(MongooseSchemas),
    TelegramModule.forRoot({
      botKey: environment.telegramAccessToken,
    }),
  ],
  providers: [
    ApiCallService,
    DeliveryAttemptService,
    NotificationListener,
    NotificationSender,
    NotificationService,
    NotificationSignatureGenerator,
    RabbitMqService,
    SendFailedPaymentNotificationsCron,
    SendRegularPaymentsNotificationsCron,
    SendProcessingPaymentNotificationsCron,
    TelegramMessenger,
    OAuthService,
    ClientService,
    NotificationMessageSnakeCaseCommand,
    RenewProcessingNotificationsCommand,
    ResendNotificationsCommand,
  ],
})

export class PaymentNotificationsModule {
  public static forRoot(): DynamicModule {

    const controllers: Array<Type<any>> = [];
    if (environment.rabbitPaymentNotificationQueueName) {
      controllers.push(NotificationBusMessageController);
    }

    return {
      controllers: [
        ...controllers,
      ],
      module: PaymentNotificationsModule,
    };
  }

}
