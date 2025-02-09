import { Document, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ChatMemberStatusEnum } from '@pe/message-kit';
import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';

import { ProfileSession, ProfileSessionEmbeddedDocument, ProfileSessionSchema } from './profile-session.schema';
import { UserPrivacy, UserPrivacySchema, UserPrivacyEmbeddedDocument } from './user-privacy.schema';

@SchemaDecorator()
export class Profile {
  @Prop({
    default: uuid,
    type: String,
  })
  public _id?: string;

  @Prop()
  public lastSeen: Date;

  @Prop({
    required: false,
    sparse: true,
    unique: true,
  })
  public username?: string;

  @Prop({
    type: UserPrivacySchema,
  })
  public privacy?: UserPrivacy;

  @Prop({
    type: [ProfileSessionSchema],
  })
  public sessions: ProfileSession[];

  @Prop({
    enum: ChatMemberStatusEnum,
    type: String,
  })
  public status: ChatMemberStatusEnum;
}

export interface ProfileDocument extends Document<string>, Profile {
  privacy?: UserPrivacyEmbeddedDocument;
  sessions: ProfileSessionEmbeddedDocument[];
}

export const ProfileSchema: Schema<ProfileDocument> =
  SchemaFactory.createForClass(Profile);
