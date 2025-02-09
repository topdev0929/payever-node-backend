import { Schema } from 'mongoose';

export const MeasureFilterSchema: Schema = new Schema(
  {
    name: {
      required: true,
      type: Schema.Types.String,
    },
    value: {
      required: true,
      type: Schema.Types.String,
    },
  },
  {
    timestamps: { },
  },
);
