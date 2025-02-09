import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';
import { Schema, Types } from 'mongoose';
import { ChatMessageInteractiveIconEnum, ChatMessageInteractiveInterface } from '@pe/message-kit';

@SchemaDecorator({
  _id: false,
  id: false,
})
export class ChatMessageInteractive implements ChatMessageInteractiveInterface {
  @Prop()
  public action?: string;

  @Prop({ required: true })
  public defaultLanguage: string;

  @Prop({
    enum: Object.values(ChatMessageInteractiveIconEnum),
    type: String,
  })
  public icon?: ChatMessageInteractiveIconEnum;

  @Prop()
  public image?: string;

  @Prop()
  public marked?: boolean;

  @Prop({
    required: true,
    type: Schema.Types.Mixed,
  })
  public translations: {
    [key: string]: string;
  };
}

export interface ChatMessageInteractiveEmbeddedDocument extends ChatMessageInteractive, Types.EmbeddedDocument {
}

export const ChatMessageInteractiveSchema: Schema<ChatMessageInteractiveEmbeddedDocument> =
  SchemaFactory.createForClass(ChatMessageInteractive);
