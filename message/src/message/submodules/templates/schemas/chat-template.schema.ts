import { v4 as uuid } from 'uuid';
import { Schema, Document } from 'mongoose';

import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';

import { MessagingTypeEnum } from '@pe/message-kit';

import { ChatAppEnum } from '../../../enums';
import { ChatTemplateInterface } from '../interfaces';
import { ChatMember, ChatMemberSchema, ChatMemberEmbeddedDocument } from '../../platform';

@SchemaDecorator()
export class ChatTemplate implements ChatTemplateInterface {
  @Prop({
    default: uuid,
    type: String,
  })
  public _id?: string;

  @Prop({
    enum: Object.values(ChatAppEnum),
    index: true,
    required: false,
    type: String,
  })
  public app?: ChatAppEnum;

  @Prop()
  public description?: string;

  @Prop({
    required: true,
  })
  public title: string;

  @Prop({
    required: false,
    type: String,
  })
  public subType?: string;

  @Prop({
    required: false,
    type: [ChatMemberSchema],
  })
  public members?: ChatMember[];

  @Prop({
    enum: MessagingTypeEnum,
    required: true,
    type: String,
  })
  public type: MessagingTypeEnum;
}

export interface ChatTemplateDocument extends Document<string>, ChatTemplate {
  members?: ChatMemberEmbeddedDocument[];
}

export const ChatTemplateSchema: Schema<ChatTemplateDocument> =
  SchemaFactory.createForClass(ChatTemplate);

export const ChatTemplateSchemaName: string = ChatTemplate.name;
