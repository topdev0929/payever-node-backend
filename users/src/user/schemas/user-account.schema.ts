import { Schema, Types } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { Prop, Schema as SchemaDecorator, SchemaFactory } from '@nestjs/mongoose';

import { ShippingAddressSchema } from './shipping-address.schema';
import {
  UserRegistractionOrigin,
  UserRegistractionOriginEmbeddedDocument,
  UserRegistrationOriginSchema,
} from './user-registration-origin.schema';
import { ShippingAddressInterface } from '../interfaces/shipping-address.interface';

@SchemaDecorator({
  timestamps: { },
})
export class UserAccount {
  @Prop({ default: uuid })
  public _id?: string;

  @Prop()
  public birthday?: string;

  @Prop()
  public email?: string;

  @Prop()
  public firstName?: string;

  @Prop()
  public hasUnfinishedBusinessRegistration?: boolean;

  @Prop()
  public language?: string;

  @Prop()
  public lastName?: string;

  @Prop()
  public logo?: string;

  @Prop()
  public phone?: string;

  @Prop({ type: UserRegistrationOriginSchema })
  public registrationOrigin?: UserRegistractionOrigin;

  @Prop()
  public salutation?: string;

  @Prop({ type : [ShippingAddressSchema] })
  public shippingAddresses?: ShippingAddressInterface[];
}

export interface UserAccountEmbeddedDocument extends UserAccount, Types.EmbeddedDocument {
  _id?: string;

  registrationOrigin: UserRegistractionOriginEmbeddedDocument;

  shippingAddresses: Types.DocumentArray<ShippingAddressInterface & Types.EmbeddedDocument>;

  readonly createdAt?: string;
}

export const UserAccountSchema: Schema<UserAccountEmbeddedDocument> = SchemaFactory.createForClass(UserAccount);

UserAccountSchema
  .index({ email: 1 });
