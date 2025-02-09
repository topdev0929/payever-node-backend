import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const UserAccountSchemaName: string = 'UserAccount';

export const UserAccountSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  email: String,
  firstName: String,
  lastName: String,
});
