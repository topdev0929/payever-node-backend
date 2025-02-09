import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { FlowCartSchema } from './flow-cart.schema';
import { FlowAddressSchema } from './flow-address.schema';
import { FlowStatesEnum } from '../../../flow/enum';
import { CallbackTypeEnum, CheckoutBusinessTypeEnum, CustomerTypeEnum } from '../../../common/enum';
import { FlowCompanySchema } from './flow-company.schema';
import { FlowFooterUrlsSchema } from './flow-footer-urls.schema';

export const FlowSchemaName: string = 'Flow';

export const FlowSchema: Schema = new Schema(
  {
    /** @deprecated use `checkoutId` instead */
    checkoutUuid: {
      required: false,
      type: String,
    },
    /** @deprecated use `_id` instead */
    flowId: {
      required: false,
      type: String,
    },

    _id: { type: String, default: uuid },

    amount: { type: Number },
    currency: { type: String },
    downPayment: { type: Number },
    reference: { type: String },
    total: { type: Number },

    cart: { type: [FlowCartSchema] },

    billingAddress: { type: FlowAddressSchema },
    shippingAddress: { type: FlowAddressSchema },

    deliveryFee: { type: Number, default: 0 },
    shippingMethodCode: { type: String },
    shippingMethodName: { type: String },

    posMerchantMode: { type: Boolean, default: false },
    posVerifyType: { type: Number },

    coupon: { type: String },

    forceLegacyCartStep: { type: Boolean, default: false },
    forceLegacyUseInventory: { type: Boolean, default: false },

    apiCallId: { type: String },
    businessId: { type: String },
    businessType: {
      default: CheckoutBusinessTypeEnum.mixed,
      required: false,
      type: String,
    },
    channel: { type: String },
    channelSetId: { type: String },
    channelType: { type: String },
    checkoutId: { type: String },
    connectionId: { type: String },
    orderId: { type: String },

    company: { type: FlowCompanySchema },

    pluginVersion: { type: String },
    state: { type: FlowStatesEnum },

    extra: { type: Schema.Types.Mixed },

    callbackTriggeredAt: { required: false, type: Date},
    callbackType: { required: false, type: CallbackTypeEnum},

    paymentId: { required: false, type: String},

    disableValidation: { type: Boolean, default: false },
    footerUrls: { type: FlowFooterUrlsSchema },
    hideImprint: { type: Boolean, default: false },
    hideLogo: { type: Boolean, default: false },

    customerType: { required: false, type: CustomerTypeEnum},
  },
  {
    timestamps: { },
  },
).index({ flowId: 1 });
