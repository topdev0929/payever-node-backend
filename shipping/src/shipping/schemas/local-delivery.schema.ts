import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ShippingOriginSchemaName } from './shipping-origin.schema';

export const LocalDeliverySchemaName: string = 'LocalDelivery';
export const LocalDeliverySchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: Schema.Types.String,
    },
    deliveryMessage: {
      type: Schema.Types.String,
    },
    deliveryPrice: {
      type: Schema.Types.Number,
    },
    deliveryRadius: {
      type: Schema.Types.Number,
    },
    minOrderPrice: {
      type: Schema.Types.Number,
    },
    postalCodes: [{
      type: Schema.Types.String,
    }],
    shippingOrigin: {
      index: true,
      ref: ShippingOriginSchemaName,
      required: true,
      type: Schema.Types.String,
    },
  },
  {
    timestamps: { },
  },
);
