import { Schema } from 'mongoose';
import { BusinessSchemaName } from '../../business/schemas/business.schema';
import { v4 as uuid } from 'uuid';
import {
  IntegrationSchemaName,
  IntegrationRuleSchemaName,
} from '../../integration/schemas';

export const ShippingMethodSchemaName: string = 'ShippingMethod';
export const ShippingMethodSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: Schema.Types.String,
    },
    businessId: {
      index: true,
      required: true,
      type: Schema.Types.String,
    },
    integration: {
      ref: IntegrationSchemaName,
      type: Schema.Types.String,
    },
    integrationRule: {
      ref: IntegrationRuleSchemaName,
      type: Schema.Types.String,
    },
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ShippingMethodSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
