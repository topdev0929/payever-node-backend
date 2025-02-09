import { Schema, Types } from 'mongoose';
import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';
import {
  ChatMessageComponentParameterTypeEnum,
  ChatMessageComponentParameterInterface,
} from '@pe/message-kit';

// tslint:disable-next-line: typedef
const mediaTypeDef = {
  link: String,
  provider: {
    name: String,
  },
};

interface MediaType {
  link: string;
  provider?: {
    name: string;
  };
}

@SchemaDecorator({
  _id: false,
  id: false,
})
export class ChatMessageComponentParameter implements ChatMessageComponentParameterInterface {
  @Prop()
  public action?: string;

  @Prop({
    type: {
      amount1000: Number,
      code: String,
      fallbackValue: String,
    },
  })
  public currency?: {
    amount1000: number;
    code: string;
    fallbackValue: string;
  };

  @Prop({ type: mediaTypeDef })
  public document?: MediaType;

  @Prop({ type: mediaTypeDef })
  public image?: MediaType;

  @Prop({ type: mediaTypeDef })
  public video?: MediaType;

  @Prop()
  public text?: string;

  @Prop({
    enum: Object.values(ChatMessageComponentParameterTypeEnum),
    type: String,
  })
  public type: ChatMessageComponentParameterTypeEnum;
}

export interface ChatMessageComponentParameterEmbeddedDocument
  extends Types.EmbeddedDocument, ChatMessageComponentParameter {
}

export const ChatMessageComponentParameterSchema: Schema<ChatMessageComponentParameterEmbeddedDocument> =
  SchemaFactory.createForClass(ChatMessageComponentParameter);
