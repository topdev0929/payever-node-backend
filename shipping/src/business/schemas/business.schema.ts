import { Schema } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import { IntegrationSubscriptionSchemaName } from '../../integration/schemas';
import { ShippingSettingSchemaName } from '../../shipping/schemas';
import { CompanyAddressSchema } from './company-address.schema';

export const BusinessSchemaName: string = 'Business';
export const BusinessSchema: Schema = new Schema(
  {
    _id: {
      default: uuidV4,
      type: Schema.Types.String,
    },
    companyAddress: {
      type: CompanyAddressSchema,
    },
    currency: {
      type: Schema.Types.String,
    },
    integrationSubscriptions: [{
      index: true,
      ref: IntegrationSubscriptionSchemaName,
      required: true,
      type: Schema.Types.String,
    }],
    name: {
      type: String,
    },
    settings: [{
      index: true,
      ref: ShippingSettingSchemaName,
      required: true,
      type: Schema.Types.String,
    }],
  },
  {
    timestamps: { },
  },
);
