import { Schema, Types, Document } from 'mongoose';
import { Schema as SchemaDecorator, SchemaFactory, Prop } from '@nestjs/mongoose';
import {
  AbstractChatMessageInterface,
  ChatMessageStatusEnum,
} from '@pe/message-kit';
import { AbstractMessage } from './abstract-message.schema';

@SchemaDecorator({
  collection: 'chatmessages',
  discriminatorKey: 'type',
  timestamps: true,
})
export class AbstractChatMessage extends AbstractMessage implements AbstractChatMessageInterface {
  @Prop()
  public sentAt: Date;

  @Prop()
  public editedAt?: Date;

  @Prop({
    default: ChatMessageStatusEnum.SENT,
    enum: Object.values(ChatMessageStatusEnum),
    index: 1,
    type: String,
  })
  public status?: ChatMessageStatusEnum;

  @Prop({
    // ref: ChatMessageTemplateSchemaName,
    index: true,
  })
  public template?: string;

  @Prop({
    index: true,
    required: false,
  })
  public sender?: string;

  @Prop({
    default: null,
    index: true,
    required: false,
  })
  public emailId?: string;

  @Prop({
    default: [],
    type: [String],
  })
  public readBy?: string[];

  @Prop({
    index: true,
    type: [String],
  })
  public deletedForUsers?: string[];  

  @Prop({ required: false })
  public isCachRead?: boolean;
}

export interface DecryptedAbstractChatMessageInterface extends AbstractChatMessageInterface {
  readonly _decrypted: true;
  content?: string;
  contentType?: string;
  contentPayload?: any;
}


export interface AbstractChatMessageDocument extends AbstractChatMessage, Document<string> {
  _id: string;
}

export interface AbstractChatMessageEmbeddedDocument extends AbstractChatMessage, Types.EmbeddedDocument {
  _id: string;  
}

export const AbstractChatMessageSchema: Schema<AbstractChatMessageDocument> =
  SchemaFactory.createForClass(AbstractChatMessage);
