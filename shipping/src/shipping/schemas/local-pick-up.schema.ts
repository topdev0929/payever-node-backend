import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { PickupTimeEnums } from '../enums';
import { ShippingOriginSchemaName } from './shipping-origin.schema';

export const LocalPickUpSchemaName: string = 'LocalPickUp';
export const LocalPickUpSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: Schema.Types.String,
    },
    pickUpMessage: {
      type: Schema.Types.String,
    },
    pickUpTime: {
      type: PickupTimeEnums,
    },
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
