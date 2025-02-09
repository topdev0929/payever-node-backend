import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { DecimalGetter } from '../../../common/decimal-getter';
import { MongooseModel } from '../../../common/enums';

export const ChannelSetMonthAmountSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    amount: { type: Schema.Types.Decimal128, required: true, get: (value: any) => DecimalGetter.get(value) },
    channelSet: { type: Schema.Types.String, required: true, ref: MongooseModel.ChannelSet },
    date: { type: String, required: true },
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
  .index({ channelSet: 1 })
  .index({ channelSet: 1, date: 1 }, { unique: true })
  ;
