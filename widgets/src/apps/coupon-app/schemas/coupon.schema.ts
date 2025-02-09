import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { CouponsStatusEnum, CouponTypeEnum } from '../enums';

export const CouponSchemaName: string = 'Coupon';

export const CouponSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: {
        index: true,
        required: true,
        type: String,
    },
    code: {
        index: true,
        required: true,
        type: String,
    },
    description: String,
    endDate: Date,
    isAutomaticDiscount: Boolean,
    name: String,
    startDate: {
        required: true,
        type: Date,
    },
    status: {
      default: CouponsStatusEnum.INACTIVE,
      enum: [
        CouponsStatusEnum.ACTIVE,
        CouponsStatusEnum.INACTIVE,
      ],
      required: true,
      type: String,
    },
    type: {
      required: true,
      type: CouponTypeEnum,
    },
  },
  {
    timestamps: true,
  },
).index({ businessId: 1, default: 1 });
