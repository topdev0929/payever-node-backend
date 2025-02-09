import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { CreatedByEnum, DimensionUnitEnums, WeightUnitEnums } from '../enums';

export const ShippingProductItemSchemaName: string = 'ShippingProductItem';
export const ShippingProductItemSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: Schema.Types.String,
    },
    createdBy: {
      default: CreatedByEnum.Merchant,
      type: String,
    },
    currency: {
      type: Schema.Types.String,
    },
    dimensionUnit: {
      type: DimensionUnitEnums,
    },
    height: {
      required: true,
      type: Schema.Types.Number,
    },
    length: {
      required: true,
      type: Schema.Types.Number,
    },
    name: {
      required: true,
      type: Schema.Types.String,
    },
    price: {
      required: true,
      type: Schema.Types.Number,
    },
    quantity: {
      required: true,
      type: Schema.Types.Number,
    },
    sku: {
      type: Schema.Types.String,
    },
    thumbnail: {
      type: Schema.Types.String,
    },
    uuid: {
      default: uuid,
      type: Schema.Types.String,
    },
    vatRate: {
      type: Schema.Types.Number,
    },
    weight: {
      required: true,
      type: Schema.Types.Number,
    },
    weightUnit: {
      type: WeightUnitEnums,
    },
    width: {
      required: true,
      type: Schema.Types.Number,
    },
  },
  {
    timestamps: { },
  },
);
