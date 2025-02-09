import { v4 as uuid } from 'uuid';
import { Schema, Document } from 'mongoose';

import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';
import type { ProfileDocument } from 'src/message';

@SchemaDecorator({
  timestamps: true,
})
export class User {
  @Prop({
    default: uuid,
    type: String,
  })
  public _id: string;

  @Prop({
    type: [String],
  })
  public businesses: string[];

  @Prop({
    type: {
      _id: String,
      email: String,
      firstName: String,
      lastName: String,
      logo: String,
      phone: String,
    },
  })
  public userAccount: {
    _id?: string;
    email: string;
    firstName: string;
    lastName: string;
    logo: string;
    phone: string;
  };

  public static hasBusiness(user: User, businessId: string): boolean {
    return user.businesses?.includes(businessId);
  }
}

export type UserInterface = User;

export interface UserDocument extends Document<string>, User {
  _id: string;
  profile?: ProfileDocument;
}

export const UserSchema: Schema = SchemaFactory.createForClass(User);


export const UserSchemaName: string = User.name;

UserSchema.virtual('profile', {
  foreignField: '_id',
  localField: '_id',
  ref: 'Profile',
});
