import { Schema, Types } from 'mongoose';

import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';

@SchemaDecorator({ _id: false })
export class UserRegistractionOrigin {
  @Prop()
  public account: string;

  @Prop()
  public source?: string;

  @Prop()
  public url: string;
}

export interface UserRegistractionOriginEmbeddedDocument extends UserRegistractionOrigin, Types.EmbeddedDocument {

}

export const UserRegistrationOriginSchema: Schema<UserRegistractionOriginEmbeddedDocument> =
  SchemaFactory.createForClass(UserRegistractionOrigin);
