import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const RuleActionSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    type: {
      required: true,
      type: String,
    },
    value: {
      required: false,
      type: Schema.Types.Mixed,
    },
    webhookUrl: {
      required: false,
      type: String,
    },
  },
);
