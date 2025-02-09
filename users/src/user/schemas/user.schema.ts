import { Document, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { Prop, Schema as SchemaDecorator, SchemaFactory } from '@nestjs/mongoose';

import { UserAccount, UserAccountEmbeddedDocument, UserAccountSchema } from './user-account.schema';
import {
    UserRegistractionOrigin,
    UserRegistractionOriginEmbeddedDocument,
    UserRegistrationOriginSchema,
} from './user-registration-origin.schema';
import { BusinessModel } from '../models';

@SchemaDecorator({
  timestamps: { },
})
export class User {
  @Prop({ default: uuid })
  public _id: string;

  @Prop({ type: [String] })
  public businesses: string[];

  @Prop({ type: UserRegistrationOriginSchema })
  public registrationOrigin: UserRegistractionOrigin;

  @Prop({ type: UserAccountSchema })
  public userAccount: UserAccount;
}

export interface UserDocument extends User, Document<string> {
  _id: string;
  registrationOrigin: UserRegistractionOriginEmbeddedDocument;
  userAccount: UserAccountEmbeddedDocument;

  readonly businessDocuments?: BusinessModel[];

  readonly createdAt?: undefined;
}

export const UserSchema: Schema<UserDocument> = SchemaFactory.createForClass(User);

export const UserSchemaName: string = User.name;

UserSchema
  .virtual('businessDocuments', {
    foreignField: '_id',
    localField: 'businesses',
    ref: 'Business',
  });

UserSchema
  .index({ business: 1 })
  .index({ businesses: 1 })
  .index({
    'userAccount.email': 'text',
    'userAccount.firstName': 'text',
    'userAccount.lastName': 'text',
    'userAccount.phone': 'text',
  });
