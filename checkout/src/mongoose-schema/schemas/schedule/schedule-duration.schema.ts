import { Schema } from 'mongoose';
import { DurationTypeEnum, DurationUnitEnum } from '../../../scheduler/enum';

export const ScheduleDurationSchema: Schema = new Schema(
  {
    period: { type: Number },
    type: { type: DurationTypeEnum },
    unit: { type: DurationUnitEnum },
  },
  {
    _id: false,
  },
);
