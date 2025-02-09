import { Schema } from 'mongoose';
import { IntegrationSchemaName } from '../../integration';
import { v4 as uuid } from 'uuid';
import { BoxTypesEnums, CreatedByEnum, DimensionUnitEnums, WeightUnitEnums } from '../enums';
import { BoxKindsEnums } from '../enums/box-kind.enum';
import { BusinessSchemaName } from '../../business/schemas/business.schema';

export const ShippingBoxSchemaName: string = 'ShippingBox';
export const ShippingBoxSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: Schema.Types.String,
    },
    businessId: {
      type: Schema.Types.String,
    },
    createdBy: {
      default: CreatedByEnum.Merchant,
      type: String,
    },
    dimensionUnit: {
      type: DimensionUnitEnums,
    },
    height: {
      type: Schema.Types.Number,
    },
    integration: {
      ref: () => IntegrationSchemaName,
      required: false,
      type: Schema.Types.String,
    },
    isDefault: {
      default: false,
      type: Schema.Types.Boolean,
    },
    kind: {
      type: BoxKindsEnums,
    },
    length: {
      type: Schema.Types.Number,
    },
    name: {
      type: Schema.Types.String,
    },
    type: {
      type: BoxTypesEnums,
    },
    weight: {
      type: Schema.Types.Number,
    },
    weightUnit: {
      type: WeightUnitEnums,
    },
    width: {
      type: Schema.Types.Number,
    },
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ShippingBoxSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
