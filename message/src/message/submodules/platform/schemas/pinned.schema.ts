import { Schema, Types } from 'mongoose';

import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';
import { AbstractChatMessage } from './message';

@SchemaDecorator({
  timestamps: true,
})
export class Pinned {
  @Prop({ required: true })
  public _id: string;

  @Prop({
    ref: AbstractChatMessage.name,
    required: true,
    type: String,
  })
  public messageId: string;

  @Prop({ required: true })
  public pinner: string;

  @Prop({ required: false, default: true })
  public forAllUsers: boolean;

  @Prop({ required: false, default: false })
  public notifyAllMembers?: boolean;
  
  message?: AbstractChatMessage;
}

export interface PinnedEmbeddedDocument extends Types.EmbeddedDocument, Pinned {
  _id: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export const PinnedSchema: Schema = SchemaFactory.createForClass(Pinned);
