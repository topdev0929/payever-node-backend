import { Schema } from 'mongoose';

export const SettingsTimeFrameStatusConditionSchema: Schema = new Schema({
  percent: {
    type: Number,
  },
  status: {
    type: String,
  },
  value: {
    type: Number,
  },
});
