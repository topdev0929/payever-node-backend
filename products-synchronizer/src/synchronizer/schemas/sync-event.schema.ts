import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const SyncEventSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    date: { type: Date, default: Date.now },
    itemId: String,
    message: String,
  },
);
