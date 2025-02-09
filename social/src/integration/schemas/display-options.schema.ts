import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const DisplayOptionsSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: Schema.Types.String,
    },
    icon: {
      type: Schema.Types.String,
    },
    order: {
      type: Schema.Types.Number,
    },
    title: {
      type: Schema.Types.String,
    },
  },
);
