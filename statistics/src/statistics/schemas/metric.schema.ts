import { Schema } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import { MetricEnum } from '../enums';

export const MetricSchemaName: string = 'Metric';
export const MetricSchema: Schema = new Schema(
  {
    _id: {
      default: uuidV4,
      type: Schema.Types.String,
    },
    name: {
      required: true,
      type: MetricEnum,
    },
    sizes: [{
      required: true,
      type: Schema.Types.String,
    }],
    suffix: {
      type: Schema.Types.String,
    },
    types: [{
      required: true,
      type: Schema.Types.String,
    }],
  },
  {
    timestamps: { },
  },
);
