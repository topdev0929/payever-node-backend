import { AbstractChannelInterface } from '@pe/message-kit';
import { Document } from 'mongoose';
import { Prop, Schema as SchemaDecorator } from '@nestjs/mongoose';
import { AbstractMessaging } from './abstract-messaging.schema';
import { AbstractChatMessageEmbeddedDocument } from './message';

@SchemaDecorator({
  collection: 'chats',
  discriminatorKey: 'type',
  timestamps: true,
})
export class AbstractChannel extends AbstractMessaging implements AbstractChannelInterface {
  @Prop()
  public description: string;

  @Prop()
  public photo: string;

  @Prop({
    default: false,
  })
  public signed: boolean;
}

export interface AbstractChannelDocument extends Document<string>, AbstractChannel {
  _id: string;
  lastMessages?: AbstractChatMessageEmbeddedDocument[];
}
