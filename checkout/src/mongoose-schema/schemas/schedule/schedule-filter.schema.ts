import { Schema } from 'mongoose';

export const ScheduleFilterSchema: Schema = new Schema(
  {
    dateGt: Date,
    dateLt: Date,
    specificStatus: String,
    status: String,
    totalGt: Number,
    totalLt: Number,
  },
  {
    _id: false,
  },
);
