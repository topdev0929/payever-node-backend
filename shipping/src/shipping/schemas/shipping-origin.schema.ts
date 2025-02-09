import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { LocalDeliverySchemaName, LocalPickUpSchemaName } from '.';
import { CreatedByEnum } from '../enums';

export const ShippingOriginSchemaName: string = 'ShippingOrigin';
export const ShippingOriginSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: Schema.Types.String,
    },
    city: {
      required: true,
      type: Schema.Types.String,
    },
    countryCode: {
      required: true,
      type: Schema.Types.String,
    },
    createdBy: {
      default: CreatedByEnum.Merchant,
      type: String,
    },
    isDefault: {
      type: Schema.Types.Boolean,
    },
    isInventoryLocation: {
      type: Schema.Types.Boolean,
    },
    localDelivery:  {
      ref: () => LocalDeliverySchemaName,
      type: Schema.Types.String,
    },
    localPickUp:  {
      ref: () => LocalPickUpSchemaName,
      type: Schema.Types.String,
    },
    name: {
      type: Schema.Types.String,
    },
    phone: {
      type: Schema.Types.String,
    },
    stateProvinceCode: {
      type: Schema.Types.String,
    },
    streetName: {
      required: true,
      type: Schema.Types.String,
    },
    streetNumber: {
      type: Schema.Types.String,
    },
    zipCode: {
      required: true,
      type: Schema.Types.String,
    },
  },
  {
    timestamps: { },
  },
);
