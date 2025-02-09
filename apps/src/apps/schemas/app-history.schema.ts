import { Schema } from 'mongoose';

export const AppHistorySchema: Schema = new Schema(
  {
    rejectionReason: {
      type: Schema.Types.String,
    },
    status: {
      required: true,
      type: Schema.Types.String,
    },
  },
  {
    _id: false,
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);
