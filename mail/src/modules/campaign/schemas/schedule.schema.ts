import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import * as mongooseIdPlugin from 'mongoose-id';
import { ScheduleStatusEnum } from '../enums';
import { CampaignSchemaName } from '../../mongoose-schema/mongoose-schema.names';

const  ScheduleInterval: Schema = new Schema(
  {
    number: { required: true, type: Number },
    type: { required: true, type: String },
  },
  { _id : false },
);

export const ScheduleSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    campaign: {
      ref: CampaignSchemaName,
      required: true,
      type: String,
    },
    cronErrors: [{ required: false, type: String }],
    date: { required: false, type: Date },
    failCount: { required: false, type: Number },
    history: [{ required: false, type: Date }],
    interval: { required: false, type: ScheduleInterval },
    recurring: {
      fulfill: { required: false, type: Number },
      target: { required: false, type: Number },
    },
    status: { required: false, type: ScheduleStatusEnum },
    type: {
      required: true,
      type: String,
    },
  },
  { timestamps: true },
)
  .index({ campaign: 1, type: 1, date: 1, 'recurring.target': 1, interval: 1 }, { unique: true });

ScheduleSchema.plugin(mongooseIdPlugin);
