import { Model, Schema } from 'mongoose';
import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import {
  AbstractMessagingSchema,
  AbstractMessaging,
  ContactSchemaName,
  ContactSchema,
  AbstractChatMessage,
  AbstractChatMessageSchema,
  ChatTextMessage,
  AbstractChatMessageDocument,
  ChatTextMessageDocument,
  ChatTextMessageSchema,
  ChatBoxMessage,
  ChatBoxMessageDocument,
  ChatBoxMessageSchema,
  ChatTemplateMessage,
  ChatTemplateMessageDocument,
  ChatTemplateMessageSchema,
} from './schemas';
import {
  ChatMessageService,
  ChatOnlineMembersService,
  ChatTypingMembersService,
  CommonMessagingService,
  ContactsService,
  MessagesDbWriterService,
  MessagesRedisService,
} from './services';
import { ProjectionsModule } from '../../../projections';
import { ChatEventMessage, ChatEventMessageDocument, ChatEventMessageSchema } from './schemas/message/event';
import { ChannelEventProducer } from './producers';


@Module({
  exports: [
    ChannelEventProducer,
    ChatMessageService,
    ChatTypingMembersService,
    ChatOnlineMembersService,
    ContactsService,
    CommonMessagingService,
    MongooseModule,
    MessagesDbWriterService,
    MessagesRedisService,
  ],
  imports: [
    ProjectionsModule,
    MongooseModule.forFeature([{
      name: AbstractMessaging.name,
      schema: AbstractMessagingSchema,
    }, {
      name: AbstractChatMessage.name,
      schema: AbstractChatMessageSchema,
    }, {
      name: ContactSchemaName,
      schema: ContactSchema,
    }]),
  ],
  providers: [
    ChannelEventProducer,
    ChatMessageService,
    ChatTypingMembersService,
    ChatOnlineMembersService,
    ContactsService,
    CommonMessagingService,
    MessagesRedisService,
    MessagesDbWriterService,
    {
      inject: [getModelToken(AbstractChatMessage.name)],
      provide: getModelToken(ChatTextMessage.name),
      useFactory(
        abstractChatMessageModel: Model<AbstractChatMessageDocument>,
      ): Model<ChatTextMessageDocument> {
        return abstractChatMessageModel.discriminator('text', ChatTextMessageSchema);
      },
    },
    {
      inject: [getModelToken(AbstractChatMessage.name)],
      provide: getModelToken(ChatEventMessage.name),
      useFactory(
        abstractChatMessageModel: Model<AbstractChatMessageDocument>,
      ): Model<ChatEventMessageDocument> {
        return abstractChatMessageModel.discriminator('event', ChatEventMessageSchema);
      },
    },
    {
      inject: [getModelToken(AbstractChatMessage.name)],
      provide: getModelToken(ChatBoxMessage.name),
      useFactory(
        abstractChatMessageModel: Model<AbstractChatMessageDocument>,
      ): Model<ChatBoxMessageDocument> {
        return abstractChatMessageModel.discriminator('box', ChatBoxMessageSchema);
      },
    },
    {
      inject: [getModelToken(AbstractChatMessage.name)],
      provide: getModelToken(ChatTemplateMessage.name),
      useFactory(
        abstractChatMessageModel: Model<AbstractChatMessageDocument>,
      ): Model<ChatTemplateMessageDocument> {
        return abstractChatMessageModel.discriminator('template', ChatTemplateMessageSchema);
      },
    },
  ],
})
export class PlatformModule { }

const lastMessagesArray: Schema.Types.DocumentArray = AbstractMessagingSchema.path('lastMessages');
lastMessagesArray.discriminator('text', ChatTextMessageSchema);
lastMessagesArray.discriminator('event', ChatEventMessageSchema);
lastMessagesArray.discriminator('template', ChatTemplateMessageSchema);
lastMessagesArray.discriminator('box', ChatBoxMessageSchema);
