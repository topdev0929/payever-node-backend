import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ConnectionSchemaName } from '../schema-names';
import {
  ChannelSettingsSchema,
  CheckoutCallbacksSchema,
  CheckoutFooterUrlsSchema,
  CheckoutSectionSchema,
  LanguageSchema,
} from './checkout';
import { CheckoutBusinessTypeEnum } from '../../common/enum';

export const CheckoutSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: String },
    channelSettings: ChannelSettingsSchema,
    default: {
      default: false,
      type: Boolean,
    },
    logo: String,
    name: String,
    sections: [CheckoutSectionSchema],
    settings: {
      businessType: {
        default: CheckoutBusinessTypeEnum.mixed,
        required: false,
        type: String,
      },
      callbacks: CheckoutCallbacksSchema,
      cspAllowedHosts: [String],

      enableCustomerAccount: {
        default: false,
        type: Boolean,
      },
      enableDisclaimerPolicy: {
        default: false,
        type: Boolean,
      },
      enableLegalPolicy: {
        default: false,
        type: Boolean,
      },
      enablePayeverTerms: {
        default: false,
        type: Boolean,
      },
      enablePrivacyPolicy: {
        default: false,
        type: Boolean,
      },
      enableRefundPolicy: {
        default: false,
        type: Boolean,
      },
      enableShippingPolicy: {
        default: false,
        type: Boolean,
      },

      customerAccount: { },
      keyword: String,
      languages: [LanguageSchema],
      message: String,
      phoneNumber: String,
      policies: { },
      styles: { require: false, type: Schema.Types.Mixed },
      testingMode: {
        default: false,
        type: Boolean,
      },
      version: { require: false, type: String },

      footerUrls: { type: CheckoutFooterUrlsSchema },
      hideImprint: { type: Boolean, default: false },
      hideLogo: { type: Boolean, default: false },
    },

    connections: [{ type: Schema.Types.String, required: true, ref: ConnectionSchemaName }],
  },
  {
    collection: 'checkouts',
    timestamps: {

    },
  },
)
  .index({ 'settings.phoneNumber': 1, 'settings.keyword': 1 }, { unique: true, sparse: true })
  .index({ businessId: 1 })
  .index({ businessId: 1, default: 1 })
  .index({
    name: 'text',
    'settings.keyword': 'text',
    'settings.message': 'text',
    'settings.phoneNumber': 'text',
  });
