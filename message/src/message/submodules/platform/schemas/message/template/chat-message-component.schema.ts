import { Schema, Types } from 'mongoose';
import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';
import {
  ChatMessageComponentTypeEnum,
  ChatMessageComponentInterface,
} from '@pe/message-kit';

import {
  ChatMessageComponentParameterSchema,
  ChatMessageComponentParameter,
  ChatMessageComponentParameterEmbeddedDocument,
} from './chat-message-component-parameter.schema';

@SchemaDecorator({
  _id: false,
  id: false,
})
export class ChatMessageComponent implements ChatMessageComponentInterface {
  @Prop({
    type: [ChatMessageComponentParameterSchema],
  })
  public parameters: ChatMessageComponentParameter[];

  @Prop({
    enum: Object.values(ChatMessageComponentTypeEnum),
    type: String,
  })
  public type: ChatMessageComponentTypeEnum;
}

export interface ChatMessageComponentEmbeddedDocument extends Types.EmbeddedDocument, ChatMessageComponent {
  parameters: ChatMessageComponentParameterEmbeddedDocument[];
}

export const ChatMessageComponentSchema: Schema<ChatMessageComponentEmbeddedDocument> =
  SchemaFactory.createForClass(ChatMessageComponent);
