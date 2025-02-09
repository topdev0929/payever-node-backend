import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { UrlActionsEnum } from '../../../legacy-api/enum';
import { TaskTypeEnum } from '../../../scheduler/enum';
import { ScheduleFilterSchema } from './schedule-filter.schema';
import { ScheduleDurationSchema } from './schedule-duration.schema';

export const ScheduleSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    action: { type: UrlActionsEnum },
    businessId: String,
    duration: { required: true, type: ScheduleDurationSchema },
    enabled: { default: true, type: Boolean },
    filter: ScheduleFilterSchema,
    lastRun: { default: null, type: Date },
    payload: Schema.Types.Mixed,
    paymentId: String,
    paymentMethod: String,
    task: { type: TaskTypeEnum },

    endDate: Date,
    startDate: Date,
  },
  {
    timestamps: { },
  },
);
