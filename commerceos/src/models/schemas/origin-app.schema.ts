import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const originAppSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    defaultApps: [{
      ref: 'DashboardApps',
      type: String,
    }],
  },
  {
    collection: 'originapps',
    timestamps: true,
  },
);
