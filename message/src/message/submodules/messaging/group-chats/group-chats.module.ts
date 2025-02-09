import { Module } from '@nestjs/common';
import { Model, SchemaType } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MessagingTypeEnum } from '@pe/message-kit';

import { GroupChat, GroupChatDocument, GroupChatSchema } from './schemas/group-chat.schema';
import { GroupChatService } from './services';
import {
  AbstractMessaging,
  AbstractMessagingDocument,
  PlatformModule,
  ChatTextMessageSchema,
  ChatTemplateMessageSchema,
  ChatBoxMessageSchema,
} from '../../platform';
import {
  CreateMessageVoter,
  ExcludeMemberVoter,
  IncludeToChatVoter,
  JoinRoomVoter,
  LeaveChatVoter,
  ReadChatMembersVoter,
  ReadChatVoter,
  SendMediaVoter,
  UpdateChatVoter,
} from './voters';
import { ChatEventMessageSchema } from '../../platform/schemas/message/event';

@Module({
  exports: [
    GroupChatService,
  ],
  imports: [
    PlatformModule,
  ],
  providers: [
    GroupChatService,

    {
      inject: [getModelToken(AbstractMessaging.name)],
      provide: getModelToken(GroupChat.name),
      useFactory(
        abstractChatModel: Model<AbstractMessagingDocument>,
      ): Model<GroupChatDocument> {
        return abstractChatModel.discriminator(MessagingTypeEnum.Group, GroupChatSchema);
      },
    },

    CreateMessageVoter,
    ExcludeMemberVoter,
    IncludeToChatVoter,
    JoinRoomVoter,
    ReadChatMembersVoter,
    LeaveChatVoter,
    ReadChatVoter,
    SendMediaVoter,
    UpdateChatVoter,
  ],
})
export class GroupChatsModule { }

const lastMessagesArray: SchemaType = GroupChatSchema.path('lastMessages');
(lastMessagesArray as any).discriminator('text', ChatTextMessageSchema);
(lastMessagesArray as any).discriminator('event', ChatEventMessageSchema);
(lastMessagesArray as any).discriminator('template', ChatTemplateMessageSchema);
(lastMessagesArray as any).discriminator('box', ChatBoxMessageSchema);
