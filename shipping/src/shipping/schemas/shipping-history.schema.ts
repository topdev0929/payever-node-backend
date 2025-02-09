import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ShippingStatusEnums } from '../enums';
import { ShippingProductItemSchemaName } from './shipping-product-item.schema';

export const ShippingHistorySchemaName: string = 'ShippingHistory';
export const ShippingHistorySchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: Schema.Types.String,
    },
    shippedItems: {
      type: [ShippingProductItemSchemaName],
    },
    status: {
      type: ShippingStatusEnums,
    },
  },
  {
    timestamps: { },
  },
);
