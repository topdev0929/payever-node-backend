import { Schema, Types } from 'mongoose';
import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';

@SchemaDecorator({
  _id: false,
  id: false,
  timestamps: true,
})
export class MemberPermissions {
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
}

export interface MemberPermissionsEmbeddedDocument extends Types.EmbeddedDocument, MemberPermissions {
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export const MemberPermissionsSchema: Schema = SchemaFactory.createForClass(MemberPermissions);
