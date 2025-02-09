import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ScheduleSchemaName: string = 'Schedule';
export const ScheduleSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  businessId: String,
  duration: String,
  email: String,
  enabled: Boolean,
  format: String,
  lastSent: Date,
  paymentMethod: String,
});
