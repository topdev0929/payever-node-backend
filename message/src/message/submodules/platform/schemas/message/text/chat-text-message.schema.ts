import { Schema, Document, Types } from 'mongoose';
import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';
import {
  ChatMessageStatusEnum,
  ChatTextMessageInterface,
} from '@pe/message-kit';
import {
  AbstractChatMessage,
  AbstractChatMessageEmbeddedDocument,
  AbstractChatMessageDocument,
} from '../abstract-chat-message.schema';
import { ChatMessageAttachmentEmbeddedDocument } from './chat-text-message-attachment.schema';
import { AbstractChatTextMessage } from './abstract-chat-text-message.schema';
import { ForwardFromEmbeddedDocument } from './forward-from.schema';

export const ChatMessageStatusTransitionMap: {
  [key in ChatMessageStatusEnum]: ChatMessageStatusEnum[];
} = {
  [ChatMessageStatusEnum.SENT]: [
    ChatMessageStatusEnum.DELIVERED,
    ChatMessageStatusEnum.READ,
  ],
  [ChatMessageStatusEnum.DELIVERED]: [
    ChatMessageStatusEnum.READ,
  ],
  [ChatMessageStatusEnum.READ]: [],
  [ChatMessageStatusEnum.DELETED]: [],
  [ChatMessageStatusEnum.FAILED]: [],
};

@SchemaDecorator({
  collection: 'chatmessages',
  discriminatorKey: 'type',
  timestamps: true,
})
export class ChatTextMessage extends AbstractChatTextMessage implements Omit<ChatTextMessageInterface, 'sender'> {

  @Prop({
    index: true,
    required: false,
    type: [String],
  })
  public mentions?: string[];


  public static isTypeOf(messageDocument: AbstractChatMessageDocument):
    messageDocument is ChatTextMessageDocument;
  public static isTypeOf(messageEmbeddedDocument: AbstractChatMessageEmbeddedDocument):
    messageEmbeddedDocument is ChatTextMessageEmbeddedDocument;
  public static isTypeOf(message: AbstractChatMessage): message is ChatTextMessage;
  public static isTypeOf(message: AbstractChatMessage): boolean {
    return message.type === 'text';
  }
}

export interface DecryptedChatTextMessageInterface extends ChatTextMessageInterface {
  readonly _decrypted: true;
}

export interface ChatTextMessageDocument extends ChatTextMessage, Document<string> {
  _id: string;
  attachments: ChatMessageAttachmentEmbeddedDocument[];
  forwardFrom?: ForwardFromEmbeddedDocument;
}

export interface ChatTextMessageEmbeddedDocument extends ChatTextMessage, Types.EmbeddedDocument {
  _id: string;
  attachments: ChatMessageAttachmentEmbeddedDocument[];
  forwardFrom?: ForwardFromEmbeddedDocument;
}

export const ChatTextMessageSchema: Schema<ChatTextMessageDocument> = SchemaFactory.createForClass(ChatTextMessage);

ChatTextMessageSchema.index({
  createdAt: 1,
});

ChatTextMessageSchema.index({
  chat: 1,
  status: 1,
});
