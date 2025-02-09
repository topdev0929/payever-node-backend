import { v4 as uuid } from 'uuid';

import { Schema, Document } from 'mongoose';

import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';

import { ChatMessageType, ChatMessageTypes } from '@pe/message-kit';

import {
  ChatMessageAttachmentSchema,
  ChatMessageComponentSchema,
  ChatMessageInteractiveSchema,
  ChatMessageAttachment,
  ChatMessageComponent,
  ChatMessageInteractive,
  ChatMessageInteractiveEmbeddedDocument,
  ChatMessageComponentEmbeddedDocument,
 } from '../../platform';
import { ChatMessageTemplateInterface } from '../interfaces';

@SchemaDecorator()
export class ChatMessageTemplate implements ChatMessageTemplateInterface {
  @Prop({
    default: uuid,
    type: String,
  })
  public _id?: string;

  @Prop()
  public action?: string;

  @Prop({
    required: false,
    type: [ChatMessageAttachmentSchema],
  })
  public attachments?: ChatMessageAttachment[];

  @Prop({
    index: true,
    required: true,
    type: String,
  })
  public chatTemplate: string;

  @Prop({
    required: false,
    type: [ChatMessageComponentSchema],
  })
  public components?: ChatMessageComponent[];

  @Prop()
  public content?: string;

  @Prop({
    required: false,
    type: ChatMessageInteractiveSchema,
  })
  public interactive?: Omit<ChatMessageInteractive, 'marked'>;

  @Prop({
    required: false,
  })
  public sender?: string;

  @Prop({
    required: false,
  })
  public order?: number;

  @Prop({
    default: 'text',
    enum: ChatMessageTypes,
    required: true,
    type: String,
  })
  public type: ChatMessageType;
}

export interface ChatMessageTemplateDocument extends Document<string>, ChatMessageTemplate {
  components?: ChatMessageComponentEmbeddedDocument[];
  interactive?: Omit<ChatMessageInteractiveEmbeddedDocument, 'marked'>;
}

export const ChatMessageTemplateSchema: Schema<ChatMessageTemplateDocument> =
  SchemaFactory.createForClass(ChatMessageTemplate);

export const ChatMessageTemplateSchemaName: string = ChatMessageTemplate.name;
