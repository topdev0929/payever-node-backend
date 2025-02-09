import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const UserSchemaName: string = 'User';
export const UserSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: Schema.Types.String,
    },
    firstName: {
      type: Schema.Types.String,
    },
    lastName: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: true,
  },
);
