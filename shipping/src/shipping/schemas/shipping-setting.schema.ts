import { Schema } from 'mongoose';
import { BusinessSchemaName } from '../../business/schemas/business.schema';
import { v4 as uuid } from 'uuid';
import { ShippingBoxSchemaName } from './shipping-box.schema';
import { ShippingOriginSchemaName } from './shipping-origin.schema';
import { ShippingZoneSchemaName } from './shipping-zone.schema';
import { ProductSchemaName } from './product.schema';
import { CreatedByEnum } from '../enums';

export const ShippingSettingSchemaName: string = 'ShippingSetting';
export const ShippingSettingSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: Schema.Types.String,
    },
    boxes: [{
      default: [],
      ref: ShippingBoxSchemaName,
      type: Schema.Types.String,
    }],
    businessId: {
      index: true,
      type: Schema.Types.String,
    },
    createdBy: {
      default: CreatedByEnum.Merchant,
      type: String,
    },
    isDefault: {
      default: false,
      type: Schema.Types.Boolean,
    },
    name: {
      type: Schema.Types.String,
    },
    origins: [{
      default: [],
      ref: ShippingOriginSchemaName,
      type: Schema.Types.String,
    }],
    products: [{
      default: [],
      ref: ProductSchemaName,
      type: Schema.Types.String,
    }],
    zones: [{
      default: [],
      ref: ShippingZoneSchemaName,
      type: Schema.Types.String,
    }],
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ShippingSettingSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
