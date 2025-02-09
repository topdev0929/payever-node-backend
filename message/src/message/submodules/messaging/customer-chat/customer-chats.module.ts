import { Module } from '@nestjs/common';
import { Model, SchemaType } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MessagingTypeEnum } from '@pe/message-kit';

import {
  CreateMessageVoter,
  ExcludeMemberVoter,
  IncludeToChatVoter,
  LeaveChatVoter,
  ReadChatMembersVoter,
  ReadChatVoter,
  SendMediaVoter,
  UpdateChatVoter,
} from './voters';
import { CustomerChat, CustomerChatSchema, CustomerChatDocument } from './schemas';
import { CustomerChatService } from './services';
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
    CustomerChatService,
  ],
  imports: [
    PlatformModule,
  ],
  providers: [
    CustomerChatService,

    {
      inject: [getModelToken(AbstractMessaging.name)],
      provide: getModelToken(CustomerChat.name),
      useFactory(
        abstractChatModel: Model<AbstractMessagingDocument>,
      ): Model<CustomerChatDocument> {
        return abstractChatModel.discriminator(MessagingTypeEnum.CustomerChat, CustomerChatSchema);
      },
    },

    CreateMessageVoter,
    ExcludeMemberVoter,
    IncludeToChatVoter,
    ReadChatMembersVoter,
    LeaveChatVoter,
    ReadChatVoter,
    SendMediaVoter,
    UpdateChatVoter,
  ],
})
export class CustomerChatsModule { }

const lastMessagesArray: SchemaType = CustomerChatSchema.path('lastMessages');
(lastMessagesArray as any).discriminator('text', ChatTextMessageSchema);
(lastMessagesArray as any).discriminator('event', ChatEventMessageSchema);
(lastMessagesArray as any).discriminator('template', ChatTemplateMessageSchema);
(lastMessagesArray as any).discriminator('box', ChatBoxMessageSchema);
