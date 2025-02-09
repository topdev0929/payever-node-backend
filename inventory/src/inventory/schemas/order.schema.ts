import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { BusinessSchemaName, ReservationSchemaName } from '../../environments/mongoose-schema.names';
import { OrderStatusEnum } from '../enums';

export const OrderSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    flow: String,
    transaction: String,

    businessId: { type: Schema.Types.String, required: true },
    reservations: [{ type: Schema.Types.String, required: true, ref: ReservationSchemaName }],
    status: { type: Schema.Types.String, default: OrderStatusEnum.TEMPORARY, enum: Object.values(OrderStatusEnum) },
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

OrderSchema.index({ flow: 1 });
OrderSchema.index({ transaction: 1 });
OrderSchema.index({ businessId: 1 });
OrderSchema.index({ status: 1, createdAt: 1 });

OrderSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
