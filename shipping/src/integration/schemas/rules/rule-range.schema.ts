import { Schema } from 'mongoose';

export const RuleRangeSchema: Schema = new Schema(
    {
      from: {
        type: Schema.Types.Number,
      },
      rate: {
        type: Schema.Types.Number,
      },
      upTo: {
        type: Schema.Types.Number,
      },
    },
    {
      _id: false,
      timestamps: false,
    },
);
