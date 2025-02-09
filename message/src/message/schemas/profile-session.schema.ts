import { Schema, Types } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';

import { MessageUserSessionInterface } from '../interfaces';

@SchemaDecorator()
export class ProfileSession implements MessageUserSessionInterface {
  @Prop({
    default: uuid,
    type: String,
  })
  public _id: string;

  @Prop()
  public ipAddress: string;

  @Prop()
  public userAgent: string;
}

export interface ProfileSessionEmbeddedDocument extends ProfileSession, Types.EmbeddedDocument {
  _id: string;
}

export const ProfileSessionSchema: Schema<ProfileSessionEmbeddedDocument> =
  SchemaFactory.createForClass(ProfileSession);
