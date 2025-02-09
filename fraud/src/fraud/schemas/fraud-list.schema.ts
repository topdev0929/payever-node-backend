import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const FraudListSchemaName: string = 'FraudList';
export const FraudListSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    businessId: {
      required: true,
      type: String,
    },
    description: {
      required: false,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    type: {
      required: true,
      type: String,
    },
    values: {
      required: false,
      type: [Schema.Types.Mixed],
    },
  },
  {
    timestamps: { },
  }
);

FraudListSchema.index({ businessId: 1 });
FraudListSchema.index({ name: 1 });
