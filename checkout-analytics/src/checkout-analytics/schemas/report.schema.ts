import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ReportSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },

    type: {
      required: true,
      type: String,
    },

    data: {
      required: true,
      type: Schema.Types.Mixed,
    },

    from: {
      required: true,
      type: Date,
    },

    to: {
      required: true,
      type: Date,
    },
  },
);
