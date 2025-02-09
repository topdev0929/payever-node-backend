import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const AffiliateBudgetSchemaName: string = 'AffiliateBudget';
export const AffiliateBudgetSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
  },
  {
    timestamps: { },
  },
);

