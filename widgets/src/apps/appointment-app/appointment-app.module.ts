import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentSchema, AppointmentSchemaName } from './schemas';
import { AppointmentService } from './services';
import { AppointmentBlogMessagesConsumer } from './consumers/appointment-messages.consumer';

@Module({
  controllers: [
    AppointmentBlogMessagesConsumer,
  ],
  exports: [
    AppointmentService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: AppointmentSchemaName, schema: AppointmentSchema },
      ],
    ),
  ],
  providers: [
    AppointmentService,
  ],
})
export class AppointmentModule { }
