import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleController } from './controllers';
import { ScheduleSchema, ScheduleSchemaName } from '../mongoose-schema';
import {
  EmailSender,
  PaymentActionProcessor,
  PaymentLinkReminderProcessor,
  ScheduleService,
  TasksProcessorsCollector,
} from './services';
import { SchedulerConsumer } from './consumers';
import { LegacyApiModule } from '../legacy-api/legacy-api.module';
import { SchedulerCron } from './cron';
import { PaymentLinksModule } from '../payment-links/payment-links.module';
import { CommonModule } from '../common/common.module';

@Module({
  controllers: [
    ScheduleController,
    SchedulerConsumer,
  ],
  exports: [

  ],
  imports: [
    CommonModule,
    LegacyApiModule,
    MongooseModule.forFeature([
      {
        name: ScheduleSchemaName,
        schema: ScheduleSchema,
      },
    ]),
    PaymentLinksModule,
  ],
  providers: [
    SchedulerCron,

    EmailSender,
    ScheduleService,

    TasksProcessorsCollector,
    PaymentLinkReminderProcessor,
    PaymentActionProcessor,
  ],
})
export class SchedulerModule { }
