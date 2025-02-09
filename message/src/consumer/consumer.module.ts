import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  ThirdPartyMessengerMessagesConsumer,
  ThirdPartyMessengerChatsConsumer,
  ThirdPartyMessengerContactsConsumer,
  ThirdPartyMessengerFirstMessageConsumer,
  BusinessInstalledAppsConsumer,
  ThirdPartyMessengerUserActivityConsumer,
  AppMessageDbOperationsConsumer,
} from './consumers';
import { MessageModule } from '../message/message.module';
import { ProjectionsModule } from '../projections/projections.module';
import { FailedFrameSchemaName, FailedFrameSchema } from './schemas/failed-frame.schema';
import { StompSubscriberExceptionsListener } from './listeners';

@Module({
  controllers: [
    ThirdPartyMessengerMessagesConsumer,
    ThirdPartyMessengerChatsConsumer,
    ThirdPartyMessengerContactsConsumer,
    ThirdPartyMessengerFirstMessageConsumer,
    ThirdPartyMessengerUserActivityConsumer,
    BusinessInstalledAppsConsumer,
    AppMessageDbOperationsConsumer,
  ],
  imports: [
    MessageModule,
    ProjectionsModule,

    MongooseModule.forFeature([{
      name: FailedFrameSchemaName,
      schema: FailedFrameSchema,
    }]),
  ],
  providers: [
    StompSubscriberExceptionsListener,
    ThirdPartyMessengerMessagesConsumer,
    ThirdPartyMessengerChatsConsumer,
    ThirdPartyMessengerContactsConsumer,
    ThirdPartyMessengerFirstMessageConsumer,
    ThirdPartyMessengerUserActivityConsumer,
    AppMessageDbOperationsConsumer,
  ],
})
export class MessagesConsumerModule { }
