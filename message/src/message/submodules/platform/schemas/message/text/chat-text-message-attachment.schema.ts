import { v4 as uuid } from 'uuid';
import { Schema, Types } from 'mongoose';

import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';

import { ChatMessageAttachmentInterface } from '@pe/message-kit';

@SchemaDecorator({
  timestamps: true,
})
export class ChatMessageAttachment implements ChatMessageAttachmentInterface {
  @Prop({
    default: uuid,
  })
  public _id?: string;

  @Prop()
  public mimeType: string;

  @Prop()
  public size: number;

  @Prop()
  public title: string;

  @Prop()
  public url: string;

  @Prop({
    type: Schema.Types.Mixed,
  })
  public data?: {
    [key: string]: string;
  };

  @Prop()
  public isCompressed?: boolean;
}

export interface ChatMessageAttachmentEmbeddedDocument extends Types.EmbeddedDocument, ChatMessageAttachment {
  _id?: string;
}

export const ChatMessageAttachmentSchema: Schema<ChatMessageAttachmentEmbeddedDocument> =
  SchemaFactory.createForClass(ChatMessageAttachment);
