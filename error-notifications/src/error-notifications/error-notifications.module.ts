import { Module, HttpModule } from '@nestjs/common';
import { CollectorModule } from '@pe/nest-kit';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseSchemas } from './config';
import {
  ErrorsBusMessageController,
  SettingsManagementController,
  ConnectionsBusMessageController,
  PaymentBusMessageController,
} from './controllers';
import {
  ErrorNotificationService,
  RabbitMqService,
  EmailTransformersList,
  EmailSender,
  SettingsService,
  ValidationService,
  TransactionsService,
} from './services';
import { SendNotificationErrorsCron } from './cron';
import { CronTestController } from './test-module';

@Module({
  controllers: [
    ErrorsBusMessageController,
    CronTestController,
    SettingsManagementController,
    ConnectionsBusMessageController,
    PaymentBusMessageController,
  ],
  exports: [],
  imports: [
    HttpModule,
    MongooseModule.forFeature(MongooseSchemas),
    CollectorModule,
  ],
  providers: [
    ErrorNotificationService,
    RabbitMqService,
    SendNotificationErrorsCron,
    EmailSender,
    ...EmailTransformersList,
    SettingsService,
    ValidationService,
    TransactionsService,
  ],
})
export class ErrorNotificationsModule { }
