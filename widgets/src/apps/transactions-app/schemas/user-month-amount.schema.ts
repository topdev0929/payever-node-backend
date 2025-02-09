import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { DecimalGetter } from '../../../common/decimal-getter';
import { MongooseModel } from '../../../common/enums';

export const UserMonthAmountSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    amount: { type: Schema.Types.Decimal128, required: true, get: (value: any) => DecimalGetter.get(value) },
    date: { type: String, required: true },
    user: { type: Schema.Types.String, required: true, ref: MongooseModel.User },
  },
  {
    toJSON: {
      transform: (doc: any, ret: any) => {
        ret.amount = DecimalGetter.get(ret.amount);

        return ret;
      },
    },
  },
)
  .index({ date: 1 })
  .index({ user: 1, date: 1 }, { unique: true })
  ;

