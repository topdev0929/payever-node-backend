import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { IntegrationSchemaName } from '../../integration/schemas';
import { CreatedByEnum, RateTypesEnums, WeightUnitEnums } from '../enums';
import { ShippingSpeedEnum } from '../enums/shipping-speed.enum';

export const ShippingRateSchemaName: string = 'ShippingRate';
export const ShippingRateSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: Schema.Types.String,
    },
    autoShow: {
      type: Schema.Types.Boolean,
    },
    createdBy: {
      default: CreatedByEnum.Merchant,
      type: String,
    },
    integration: {
      ref: IntegrationSchemaName,
      required: true,
      type:  Schema.Types.String,
    },
    maxPrice: {
      type: Schema.Types.Number,
    },
    maxWeight: {
      type: Schema.Types.Number,
    },
    minPrice: {
      type: Schema.Types.Number,
    },
    minWeight: {
      type: Schema.Types.Number,
    },
    name: {
      type: Schema.Types.String,
    },
    ratePrice: {
      type: Schema.Types.Number,
    },
    rateType: {
      type: RateTypesEnums,
    },
    serviceCode: {
      type: Schema.Types.String,
    },
    shippingSpeed: {
      type: ShippingSpeedEnum,
    },
    weightUnit: {
      type: WeightUnitEnums,
    },
  },
  {
    timestamps: { },
  },
);
