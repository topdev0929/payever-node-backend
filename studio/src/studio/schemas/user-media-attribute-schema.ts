import { Schema } from 'mongoose';
import { UserAttributeSchemaName } from './user-attribute.schema';

export const UserMediaAttributeSchemaName: string = 'UserMediaAttribute';
export const UserMediaAttributeSchema: Schema = new Schema(
  {
    attribute: { type: String, ref: UserAttributeSchemaName },
    value: String,
  },
  { _id : false },
);
