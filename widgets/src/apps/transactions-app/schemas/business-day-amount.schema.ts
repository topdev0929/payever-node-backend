import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { DecimalGetter } from '../../../common/decimal-getter';
import { MongooseModel } from '../../../common/enums';

export const BusinessDayAmountSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    amount: { type: Schema.Types.Decimal128, required: true, get: (value: any) => DecimalGetter.get(value) },
    businessId: { type: Schema.Types.String, required: true },
    date: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (doc: any, ret: any) => {
        ret.amount = DecimalGetter.get(ret.amount);

        return ret;
      },
      virtuals: true,
    },
    toObject: { virtuals: true },
  },
)
  .index({ businessId: 1 })
  .index({ businessId: 1, date: 1 }, { unique: true })
  ;

BusinessDayAmountSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: MongooseModel.Business,
});
