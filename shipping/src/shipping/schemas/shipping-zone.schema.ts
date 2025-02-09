import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { CreatedByEnum } from '../enums';
import { ShippingRateSchemaName } from './shipping-rate.schema';

export const ShippingZoneSchemaName: string = 'ShippingZone';
export const ShippingZoneSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: Schema.Types.String,
    },
    countryCodes: [{
      type: Schema.Types.String,
    }],
    createdBy: {
      default: CreatedByEnum.Merchant,
      type: String,
    },
    deliveryTimeDays: {
      type: Schema.Types.Number,
    },
    name: {
      type: Schema.Types.String,
    },
    rates: {
      type: [ShippingRateSchemaName],
    },
  },
  {
    timestamps: { },
  },
);
