import { Schema, Document, Types } from 'mongoose';
import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';
import { ChatEventMessageInterface } from '@pe/message-kit';
import {
  AbstractChatMessage,
  AbstractChatMessageDocument,
  AbstractChatMessageEmbeddedDocument,
} from '../abstract-chat-message.schema';

@SchemaDecorator()
export class ChatEventMessage extends AbstractChatMessage implements ChatEventMessageInterface {
  public readonly type: 'event';

  @Prop({ type: String })
  public eventName: string;


  public static isTypeOf(messageDocument: AbstractChatMessageDocument):
    messageDocument is ChatEventMessageDocument;
  public static isTypeOf(messageEmbeddedDocument: AbstractChatMessageEmbeddedDocument):
    messageEmbeddedDocument is ChatEventMessageEmbeddedDocument;
  public static isTypeOf(message: AbstractChatMessage): message is ChatEventMessageDocument;
  public static isTypeOf(message: AbstractChatMessage): boolean {
    return message.type === 'event';
  }
}

export interface ChatEventMessageDocument extends ChatEventMessage, Document<string> {
  _id: string;
  eventName: string;
}

export interface ChatEventMessageEmbeddedDocument extends ChatEventMessage, Types.EmbeddedDocument {
  _id: string;
  eventName: string;
}

export const ChatEventMessageSchema: Schema<ChatEventMessageDocument> =
  SchemaFactory.createForClass(ChatEventMessage);
