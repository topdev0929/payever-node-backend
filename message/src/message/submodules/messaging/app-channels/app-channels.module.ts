import { Module } from '@nestjs/common';
import { Model, SchemaType } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MessagingTypeEnum } from '@pe/message-kit';

import { AppChannel, AppChannelDocument, AppChannelSchema } from './schemas';
import {
  AbstractMessaging,
  AbstractMessagingDocument,
  PlatformModule,
  ChatTextMessageSchema,
  ChatTemplateMessageSchema,
  ChatBoxMessageSchema,
} from '../../platform';
import { AppChannelService } from './services';
import {
  AppChannelVoter,
} from './voters';
import { ChatEventMessageSchema } from '../../platform/schemas/message/event';

@Module({
  exports: [
    AppChannelService,
  ],
  imports: [
    PlatformModule,
  ],
  providers: [
    AppChannelService,
    {
      inject: [getModelToken(AbstractMessaging.name)],
      provide: getModelToken(AppChannel.name),
      useFactory(
        abstractChatModel: Model<AbstractMessagingDocument>,
      ): Model<AppChannelDocument> {
        return abstractChatModel.discriminator(MessagingTypeEnum.AppChannel, AppChannelSchema);
      },
    },

    AppChannelVoter,
  ],
})
export class AppChannelsModule { }

const lastMessagesArray: SchemaType = AppChannelSchema.path('lastMessages');
(lastMessagesArray as any).discriminator('text', ChatTextMessageSchema);
(lastMessagesArray as any).discriminator('event', ChatEventMessageSchema);
(lastMessagesArray as any).discriminator('template', ChatTemplateMessageSchema);
(lastMessagesArray as any).discriminator('box', ChatBoxMessageSchema);
