import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const CronTaskSchemaName: string = 'CronTask';
export const CronTaskSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    date: Date,
    day: Number,
    dayOfWeek: String,
    hours: Number,
    input: Object,
    minutes: Number,
    period: String,
  },
);
