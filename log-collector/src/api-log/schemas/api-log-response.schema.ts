import { Schema } from 'mongoose';

export const ApiLogResponseSchema: Schema = new Schema(
  {
    data: Schema.Types.Mixed,
    error: Schema.Types.Mixed,
    headers: Schema.Types.Mixed,
    statusCode: Number,
  },
  { _id: false, timestamps: false },
);
