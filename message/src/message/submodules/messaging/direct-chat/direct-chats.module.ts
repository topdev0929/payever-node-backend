import { Module } from '@nestjs/common';
import { Model, SchemaType } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MessagingTypeEnum } from '@pe/message-kit';

import {
  DirectChatVoter,
} from './voters';
import { DirectChat, DirectChatSchema, DirectChatDocument } from './schemas';
import { DirectChatService } from './services';
import {
  AbstractMessaging,
  AbstractMessagingDocument,
  PlatformModule,
  ChatTemplateMessageSchema,
  ChatTextMessageSchema,
  ChatBoxMessageSchema,
} from '../../platform';
import { ChatEventMessageSchema } from '../../platform/schemas/message/event';

@Module({
  exports: [
    DirectChatService,
  ],
  imports: [
    PlatformModule,
  ],
  providers: [
    DirectChatService,

    {
      inject: [getModelToken(AbstractMessaging.name)],
      provide: getModelToken(DirectChat.name),
      useFactory(
        abstractChatModel: Model<AbstractMessagingDocument>,
      ): Model<DirectChatDocument> {
        return abstractChatModel.discriminator(MessagingTypeEnum.DirectChat, DirectChatSchema);
      },
    },

    DirectChatVoter,
  ],
})
export class DirectChatsModule { }

const lastMessagesArray: SchemaType = DirectChatSchema.path('lastMessages');
(lastMessagesArray as any).discriminator('text', ChatTextMessageSchema);
(lastMessagesArray as any).discriminator('event', ChatEventMessageSchema);
(lastMessagesArray as any).discriminator('template', ChatTemplateMessageSchema);
(lastMessagesArray as any).discriminator('box', ChatBoxMessageSchema);
