import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import type { UserInterface } from '../interfaces';

import { UserAccountSchema } from './user-account.schema';

export const UserSchemaName: string = 'User';

export const UserSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    userAccount: UserAccountSchema,
  },
  {
    timestamps: true,
  },
);

UserSchema.methods.getFullName = function(this: UserInterface): string {
  const fullName: string = [this.userAccount.firstName, this.userAccount.lastName]
    .filter((value: string) => value)
    .join(' ');
  if (fullName) {
    return fullName;
  }

  return this.userAccount.email;
};
