import { Schema } from 'mongoose';

import { DecimalGetter } from '../../../common/decimal-getter';

export const UserPerBusinessMonthAmountSchema: Schema = new Schema({
  _id: String,

  amount: {
    get: (value: any) => DecimalGetter.get(value),
    required: true,
    type: Schema.Types.Decimal128,
  },
  currency: String,
  date: String,

  businessId: {
    required: true,
    type: String,
  },
  userId: {
    required: true,
    type: String,
  },
});

