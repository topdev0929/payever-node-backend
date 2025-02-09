import { Schema } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

import { CreatedByEnum } from '../enums';
import { BusinessSchemaName } from './business.schema';
import { DashboardModel } from '../models';

export const DashboardSchemaName: string = 'Dashboard';
export const DashboardSchema: Schema<DashboardModel> = new Schema<DashboardModel>(
  {
    _id: {
      default: uuidV4,
      type: Schema.Types.String,
    },
    businessId: {
      index: true,
      type: Schema.Types.String,
    },
    createdBy: {
      default: CreatedByEnum.Merchant,
      type: String,
    },
    isDefault: {
      default: false,
      type: Boolean,
    },
    name: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

DashboardSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
