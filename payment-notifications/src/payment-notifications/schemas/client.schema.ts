import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ClientSchemaName: string = 'Client';
export const ClientSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    secret: {
      required: true,
      type: String,
      unique: false,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
