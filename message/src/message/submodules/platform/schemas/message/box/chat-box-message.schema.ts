import { Schema, Document, Types } from 'mongoose';
import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';
import {
  ChatBoxMessageInterface,
} from '@pe/message-kit';

import {
  AbstractChatMessage,
  AbstractChatMessageDocument,
  AbstractChatMessageEmbeddedDocument,
} from '../abstract-chat-message.schema';
import {
  ChatMessageInteractiveSchema,
  ChatMessageInteractive,
  ChatMessageInteractiveEmbeddedDocument,
} from './chat-message-interactive.schema';
import { ForwardFromSchema, ForwardFrom, ForwardFromEmbeddedDocument } from '../text';

@SchemaDecorator()
export class ChatBoxMessage extends AbstractChatMessage implements ChatBoxMessageInterface {
  public readonly type: 'box';

  @Prop({
    type: ForwardFromSchema,
  })
  public forwardFrom?: ForwardFrom;

  @Prop({
    type: ChatMessageInteractiveSchema,
  })
  public interactive: ChatMessageInteractive;
  public static isTypeOf(messageDocument: AbstractChatMessageDocument):
    messageDocument is ChatBoxMessageDocument;
  public static isTypeOf(messageEmbeddedDocument: AbstractChatMessageEmbeddedDocument):
    messageEmbeddedDocument is ChatBoxMessageEmbeddedDocument;
  public static isTypeOf(message: AbstractChatMessage): message is ChatBoxMessage;
  public static isTypeOf(message: AbstractChatMessage): boolean {
    return message.type === 'box';
  }
}

export interface ChatBoxMessageDocument extends ChatBoxMessage, Document<string> {
  _id: string;
  interactive: ChatMessageInteractiveEmbeddedDocument;
  forwardFrom?: ForwardFromEmbeddedDocument;
}

export interface ChatBoxMessageEmbeddedDocument extends ChatBoxMessage, Types.EmbeddedDocument {
  _id: string;
  interactive: ChatMessageInteractiveEmbeddedDocument;
  forwardFrom?: ForwardFromEmbeddedDocument;
}

export const ChatBoxMessageSchema: Schema<ChatBoxMessageDocument> =
  SchemaFactory.createForClass(ChatBoxMessage);
