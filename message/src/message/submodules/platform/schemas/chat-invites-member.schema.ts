import { Schema, Types } from 'mongoose';
import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';

@SchemaDecorator({
  timestamps: true,
})
export class ChatInvitedMember {
  @Prop({
    default: uuid,
    type: String,
  })
  public _id: string;

  @Prop()
  public email?: string;

  @Prop()
  public contactId?: string;

  @Prop()
  public name?: string;

  @Prop()
  public invitedAt?: Date;
}

export interface ChatInvitedMemberEmbeddedDocument extends Types.EmbeddedDocument, ChatInvitedMember {
  readonly _id: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export const ChatInvitedMemberSchema: Schema = SchemaFactory.createForClass(ChatInvitedMember);
