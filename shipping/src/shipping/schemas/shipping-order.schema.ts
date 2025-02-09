import { Schema } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import { ShippingMethodSchema } from './shipping-method.schema';
import { ShippingOriginSchemaName } from './shipping-origin.schema';
import { ShippingProductItemSchema } from './shipping-product-item.schema';
import { ShippingBoxSchema } from './shipping-box.schema';
import { ShippingHistorySchema } from './shipping-history.schema';
import { AddressSchema } from './address.schema';
import { ShippingStatusEnums } from '../enums';
import { BusinessSchemaName } from '../../business/schemas/business.schema';

export const ShippingOrderSchemaName: string = 'ShippingOrder';
export const ShippingOrderSchema: Schema = new Schema(
  {
    _id: {
      default: uuidV4,
      type: Schema.Types.String,
    },
    billingAddress: {
      type: AddressSchema,
    },
    businessId: {
      index: true,
      required: true,
      type: Schema.Types.String,
    },
    businessName: {
      type: Schema.Types.String,
    },
    label: {
      type: Schema.Types.String,
    },
    legalText: {
      type: Schema.Types.String,
    },
    processedAt: {
      type: Date,
    },
    serviceCode: {
      type: Schema.Types.String,
    },
    shipmentNumber: {
      type: Schema.Types.String,
    },
    shippedAt: {
      type: Date,
    },
    shippingAddress: {
      type: AddressSchema,
    },
    shippingBoxes: {
      type: [ShippingBoxSchema],
    },
    shippingHistory: {
      type: [ShippingHistorySchema],
    },
    shippingItems: {
      type: [ShippingProductItemSchema],
    },
    shippingMethod: {
      type: ShippingMethodSchema,
    },
    shippingOrigin: {
      ref: ShippingOriginSchemaName,
      required: true,
      type: Schema.Types.String,
    },
    status: {
      type: ShippingStatusEnums,
    },
    trackingId: {
      type: Schema.Types.String,
    },
    trackingUrl: {
      type: Schema.Types.String,
    },
    transactionId: {
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
