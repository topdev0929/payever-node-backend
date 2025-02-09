import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { DecimalGetter } from '../../common/decimal-getter';
import { MongooseModel } from '../../common/enums';

export const ChannelSetSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    active: { type: Boolean, default: false },
    businessId: { type: Schema.Types.String, required: true },
    currency: { type: String, required: true },
    name: { type: String },
    revenue: { type: Schema.Types.Decimal128, default: 0.0, get: (value: any) => DecimalGetter.get(value) },
    sells: { type: Number, default: 0 },
    type: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (doc: any, ret: any) => {
        ret.revenue = DecimalGetter.get(ret.revenue);

        return ret;
      },
      virtuals: true,
    },
    toObject: { virtuals: true },
  },
);

ChannelSetSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: MongooseModel.Business,
});
