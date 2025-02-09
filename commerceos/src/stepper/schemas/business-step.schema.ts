import { v4 as uuid } from 'uuid';
import { Schema } from 'mongoose';
import { DefaultStepSchemaName } from './deafult-step.schema';

export const BusinessStepSchemaName: string = 'BusinessStep';
export const BusinessStepSchema: Schema = new Schema(
  {
    _id: { default: uuid, type: String },
    businessId: { type: String },
    isActive: Boolean,
    section: String,
    step: { type: String, ref: DefaultStepSchemaName },
  },
);

BusinessStepSchema.index({ business: 1, section: 1, step: 1 }, { unique: true });
BusinessStepSchema.index({ business: 1, section: 1 });
BusinessStepSchema.index({ business: 1 });
