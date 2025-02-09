import { Schema, Document } from 'mongoose';

import { SchemaFactory, Schema as SchemaDecorator } from '@nestjs/mongoose';
import {
  MessagingTypeEnum,
  DirectChatInterface,
} from '@pe/message-kit';

import {
  AbstractMessaging,
  AbstractMessagingDocument,
  AbstractChatMessageEmbeddedDocument,
} from '../../../platform';
import { PinnedEmbeddedDocument } from '../../../platform/schemas/pinned.schema';

@SchemaDecorator({
  collection: 'chats',
  discriminatorKey: 'type',
  timestamps: true,
})
export class DirectChat extends AbstractMessaging implements DirectChatInterface {
  public type: MessagingTypeEnum.DirectChat;
  public static isTypeOf(chat: AbstractMessaging): chat is DirectChat;
  public static isTypeOf(chat: AbstractMessagingDocument): chat is DirectChatDocument {
    return chat.type === MessagingTypeEnum.DirectChat;
  }
}

export interface DirectChatDocument extends Document<string>, DirectChat {
  _id: string;
  lastMessages?: AbstractChatMessageEmbeddedDocument[];
  pinned?: PinnedEmbeddedDocument[];
}

export const DirectChatSchema: Schema<DirectChatDocument> = SchemaFactory.createForClass(DirectChat);
