import { Schema } from 'mongoose';

export const CounterSchemaName: string = 'Counter';
export const CounterSchema: Schema = new Schema(
  {
    businessId: String,
    name: {
      index: true,
      type: String,
    },
    type: {
      index: true,
      type: String,
    },
    value: Number,
  },
);
