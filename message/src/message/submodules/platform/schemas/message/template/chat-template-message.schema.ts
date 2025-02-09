import { Schema, Document, Types } from 'mongoose';
import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';
import { ChatTemplateMessageInterface } from '@pe/message-kit';

import {
  AbstractChatMessage,
  AbstractChatMessageDocument,
  AbstractChatMessageEmbeddedDocument,
} from '../abstract-chat-message.schema';
import {
  ChatMessageComponentEmbeddedDocument,
  ChatMessageComponent,
  ChatMessageComponentSchema,
} from './chat-message-component.schema';

@SchemaDecorator()
export class ChatTemplateMessage extends AbstractChatMessage implements ChatTemplateMessageInterface {
  public readonly type: 'template';

  @Prop({
    type: [ChatMessageComponentSchema],
  })
  public components: ChatMessageComponent[];

  public static isTypeOf(messageDocument: AbstractChatMessageDocument):
    messageDocument is ChatTemplateMessageDocument;
  public static isTypeOf(messageEmbeddedDocument: AbstractChatMessageEmbeddedDocument):
    messageEmbeddedDocument is ChatTemplateMessageEmbeddedDocument;
  public static isTypeOf(message: AbstractChatMessage): message is ChatTemplateMessage;
  public static isTypeOf(message: AbstractChatMessage): boolean {
    return message.type === 'template';
  }
}

export interface ChatTemplateMessageDocument extends ChatTemplateMessage, Document<string> {
  _id: string;
  components: ChatMessageComponentEmbeddedDocument[];
}

export interface ChatTemplateMessageEmbeddedDocument extends ChatTemplateMessage, Types.EmbeddedDocument {
  _id: string;
  components: ChatMessageComponentEmbeddedDocument[];
}

export const ChatTemplateMessageSchema: Schema<ChatTemplateMessageDocument> =
  SchemaFactory.createForClass(ChatTemplateMessage);
