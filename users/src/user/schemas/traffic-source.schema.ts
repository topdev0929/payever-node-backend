import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessSchemaName } from '../schemas';

export const TrafficSourceSchemaName: string = 'TrafficSource';
export const TrafficSourceSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: {
      type: String,
    },
    campaign: String,
    content: String,
    medium: String,
    source: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)
.index({ businessId: 1 }, { unique: true });

TrafficSourceSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
