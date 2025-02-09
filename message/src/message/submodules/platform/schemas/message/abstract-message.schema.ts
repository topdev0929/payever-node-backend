import { v4 as uuid } from 'uuid';
import { Schema } from 'mongoose';
import { Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';
import { ChatMessageType } from '@pe/message-kit';

@SchemaDecorator({
  timestamps: true,
})
export class AbstractMessage {
  @Prop({
    default: uuid,
    required: true,
    type: String,
  })
  public _id: string;

  @Prop({
    index: true,
    required: true,
  })
  public chat: string;

  @Prop({
    type: Schema.Types.Mixed,
  })
  public data?: {
    [key: string]: string;
  };

  public type: ChatMessageType;

  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}
