import { Module } from '@nestjs/common';
import { Model, Schema } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MessagingTypeEnum } from '@pe/message-kit';

import { SupportChannel, SupportChannelDocument, SupportChannelSchema } from './schemas';
import { SupportChannelService } from './services';
import {
  CreateMessageVoter,
  JoinRoomVoter,
} from './voters';
import {
  AbstractMessaging,
  AbstractMessagingDocument,
  PlatformModule,
  ChatTextMessageSchema,
  ChatTemplateMessageSchema,
  ChatBoxMessageSchema,
} from '../../platform';
import { ChatEventMessageSchema } from '../../platform/schemas/message/event';

@Module({
  exports: [
    SupportChannelService,
  ],
  imports: [
    PlatformModule,
  ],
  providers: [
    SupportChannelService,
    {
      inject: [getModelToken(AbstractMessaging.name)],
      provide: getModelToken(SupportChannel.name),
      useFactory(
        abstractChatModel: Model<AbstractMessagingDocument>,
      ): Model<SupportChannelDocument> {
        return abstractChatModel.discriminator(MessagingTypeEnum.SupportChannel, SupportChannelSchema);
      },
    },

    CreateMessageVoter,
    JoinRoomVoter,
  ],
})
export class SupportChannelsModule { }

const lastMessagesArray: Schema.Types.Array = SupportChannelSchema.path('lastMessages');
lastMessagesArray.discriminator('text', ChatTextMessageSchema);
lastMessagesArray.discriminator('event', ChatEventMessageSchema);
lastMessagesArray.discriminator('template', ChatTemplateMessageSchema);
lastMessagesArray.discriminator('box', ChatBoxMessageSchema);
