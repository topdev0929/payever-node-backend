import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const AppointmentSchemaName: string = 'Appointment';

export const AppointmentSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    allDay: Boolean,
    businessId: String,
    date: String,
    localtion: String,
    note: String,
    repeat: Boolean,
    time: String,
  },
  {
    timestamps: true,
  },
).index({ businessId: 1, default: 1 });
