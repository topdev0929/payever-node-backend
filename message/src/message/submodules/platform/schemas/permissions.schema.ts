import { Schema, Types } from 'mongoose';
import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';

@SchemaDecorator({
  _id: false,
  id: false,
  timestamps: true,
})
export class Permissions {

  @Prop({
    default: true,
    type: Boolean,
  })
  public change: boolean;

  @Prop({
    default: true,
    type: Boolean,
  })
  public showSender: boolean;

  @Prop({
    default: true,
    type: Boolean,
  })
  public addMembers: boolean;

  @Prop({
    default: true,
    type: Boolean,
  })
  public pinMessages: boolean;

  @Prop({
    default: true,
    type: Boolean,
  })
  public sendMedia: boolean;

  @Prop({
    default: true,
    type: Boolean,
  })
  public sendMessages: boolean;

  @Prop({
    default: false,
    type: Boolean,
  })
  public live: boolean;
}

export interface PermissionsEmbeddedDocument extends Types.EmbeddedDocument, Permissions {
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export const PermissionsSchema: Schema = SchemaFactory.createForClass(Permissions);
