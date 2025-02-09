import { Schema } from 'mongoose';
import { SettingsTimeFrameStatusConditionSchema } from './settings-time-frame-status-condition.schema';

export const SettingsTimeFrameItemSchema: Schema = new Schema({
  startDayOfWeek: {
    type: Number,
  },
  startHour: {
    type: Number,
  },
  startMinutes: {
    type: Number,
  },

  endDayOfWeek: {
    type: Number,
  },
  endHour: {
    type: Number,
  },
  endMinutes: {
    type: Number,
  },

  repeatFrequencyInterval: {
    type: Number,
  },
  sendEmailAfterInterval: {
    type: Number,
  },

  statusCondition: {
    default: null,
    required: false,
    type: SettingsTimeFrameStatusConditionSchema,
  },

});
