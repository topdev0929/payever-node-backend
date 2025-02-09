import { Schema, Document } from 'mongoose';

import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';
import {
  MessagingTypeEnum,
  CustomerChatInterface,
  MessagingIntegrationsEnum,
} from '@pe/message-kit';
import {
  AbstractMessaging,
  AbstractMessagingDocument,
  AbstractChatMessageEmbeddedDocument,
  ContactSchemaName,
} from '../../../platform';
import { PinnedEmbeddedDocument } from '../../../platform/schemas/pinned.schema';

@SchemaDecorator({
  collection: 'chats',
  discriminatorKey: 'type',
  timestamps: true,
})
export class CustomerChat extends AbstractMessaging implements CustomerChatInterface {
  @Prop({
    index: true,
    required: true,
  })
  public business: string;

  @Prop({
    enum: Object.values(MessagingIntegrationsEnum),
    index: true,
    required: true,
    type: String,
  })
  public integrationName: MessagingIntegrationsEnum;

  @Prop({
    index: true,
    ref: ContactSchemaName,
    required: true,
  })
  public contact: string;

  public type: MessagingTypeEnum.CustomerChat;
  public static isTypeOf(chat: AbstractMessaging): chat is CustomerChat;
  public static isTypeOf(chat: AbstractMessagingDocument): chat is CustomerChatDocument {
    return chat.type === MessagingTypeEnum.CustomerChat;
  }
}

export interface CustomerChatDocument extends Document<string>, CustomerChat {
  _id: string;
  lastMessages?: AbstractChatMessageEmbeddedDocument[];
  pinned?: PinnedEmbeddedDocument[];
}

export const CustomerChatSchema: Schema<CustomerChatDocument> = SchemaFactory.createForClass(CustomerChat);
