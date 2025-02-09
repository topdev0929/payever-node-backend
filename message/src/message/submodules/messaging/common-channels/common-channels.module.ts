import { Module } from '@nestjs/common';
import { Model, SchemaType } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MessagingTypeEnum } from '@pe/message-kit';
import { CommonChannel, CommonChannelDocument, CommonChannelSchema } from './schemas/common-channel.schema';
import { CommonChannelService } from './services';
import {
  AbstractMessagingDocument,
  AbstractMessaging,
  PlatformModule,
  ChatTextMessageSchema,
  ChatTemplateMessageSchema,
  ChatBoxMessageSchema,
} from '../../platform';
import {
  CreateMessageVoter,
  ExcludMemberVoter,
  IncludeToChatVoter,
  JoinRoomVoter,
  ReadChatMembersVoter,
  ReadChatVoter,
  LeaveChatVoter,
  SendMediaVoter,
  UpdateChatVoter,
} from './voters';
import { ChatEventMessageSchema } from '../../platform/schemas/message/event';

@Module({
  exports: [
    CommonChannelService,
  ],
  imports: [
    PlatformModule,
  ],
  providers: [
    CommonChannelService,
    {
      inject: [getModelToken(AbstractMessaging.name)],
      provide: getModelToken(CommonChannel.name),
      useFactory(
        abstractChatModel: Model<AbstractMessagingDocument>,
      ): Model<CommonChannelDocument> {
        return abstractChatModel.discriminator(MessagingTypeEnum.Channel, CommonChannelSchema);
      },
    },
    CreateMessageVoter,
    ExcludMemberVoter,
    IncludeToChatVoter,
    JoinRoomVoter,
    ReadChatMembersVoter,
    ReadChatVoter,
    LeaveChatVoter,
    SendMediaVoter,
    UpdateChatVoter,
  ],
})
export class CommonChannelsModule { }

const lastMessagesArray: SchemaType = CommonChannelSchema.path('lastMessages');
(lastMessagesArray as any).discriminator('text', ChatTextMessageSchema);
(lastMessagesArray as any).discriminator('event', ChatEventMessageSchema);
(lastMessagesArray as any).discriminator('template', ChatTemplateMessageSchema);
(lastMessagesArray as any).discriminator('box', ChatBoxMessageSchema);
