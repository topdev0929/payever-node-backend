/* eslint-disable @typescript-eslint/tslint/config */
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ApiCallAddressSchema } from './api-call-address.schema';
import { ApiCallSellerSchema } from './api-call-seller.schema';
import { ApiCallMessageSchema } from './api-call-message.schema';
import { Encryption } from '@pe/nest-kit';
import { ApiCallCompanySchema } from './api-call-company.schema';
import { ApiCallShippingOptionSchema } from './api-call-shipping-option.schema';
import { ApiCallSplitSchema } from './api-call-split.schema';
import { ApiCallFooterUrlsSchema } from './api-call-footer-urls.schema';

export const ApiCallSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: String, required: true },

    address_line_2: String,
    allow_cart_step: { type: Boolean, required: false, default: false },
    amount: { type: Number, required: false },
    birthdate: Date,
    cancel_url: String,
    cart: { required: false, type: Schema.Types.Mixed },
    channel: String,
    channel_type: String,
    channel_source: String,
    channel_set_id: String,
    city: String,
    client_id: { required: false, type: String },
    country: String,
    currency: { type: String, required: false },
    customer_redirect_url: String,
    email: String,
    execution_time: { type: String, required: false },
    expires_at: { required: false, type: Date },
    extra: { required: false, type: Schema.Types.Mixed },
    failure_url: String,
    fee: { type: Number, default: 0 },
    down_payment: { type: Number, default: 0 },
    first_name: String,
    flowId: String,
    last_name: String,
    link_message: { type: ApiCallMessageSchema, required: false },
    locale: { type: String, required: false },
    notice_url: String,
    order_id: { type: String, required: false },
    payment_method: String,
    payment_issuer: { type: String, required: false },
    original_mapped_payment_method: String,
    pending_url: String,
    phone: String,
    plugin_version: String,
    region: { type: String, required: false },
    reusable: { type: Boolean, required: false },
    salutation: String,
    seller: { type: ApiCallSellerSchema, required: false },
    shipping_address: { type: ApiCallAddressSchema, required: false },
    social_security_number: String,
    street: String,
    street_number: String,
    success_url: String,
    use_inventory: { type: Boolean, required: false, default: false },
    variant_id: String,
    original_mapped_variant_id: String,
    verify_type: String,
    verify_two_factor: String,
    two_factor_triggered: { type: Boolean, required: false, default: false },
    skip_handle_payment_fee: { type: Boolean, required: false },
    x_frame_host: String,
    zip: String,

    organization_name: String,
    street_name: String,
    house_extension: String,
    reference_extra: String,
    purchase_country: String,
    customer_type: String,
    customer_gender: String,
    company: ApiCallCompanySchema,
    shipping_option: ApiCallShippingOptionSchema,
    splits: [ApiCallSplitSchema],
    allow_separate_shipping_address: Boolean,
    allow_customer_types: [String],
    allow_payment_methods: [String],
    allow_billing_step: Boolean,
    allow_shipping_step: Boolean,
    use_styles: Boolean,
    use_default_variant: Boolean,
    use_iframe: Boolean,
    salutation_mandatory: Boolean,
    phone_mandatory: Boolean,
    birthdate_mandatory: Boolean,
    test_mode: Boolean,
    api_version: String,
    order_ref: String,
    original_cart: Schema.Types.Mixed,
    hide_logo: Boolean,
    hide_imprint: Boolean,
    auto_capture_enabled: Boolean,
    auto_capture_date: Date,
    footer_urls: ApiCallFooterUrlsSchema,
    payment_link_id: String,
    disable_validation: Boolean,
  },
  {
    timestamps: { },
  },
);

ApiCallSchema.pre(/^(save|updateOne|findOneAndUpdate)/, async function(next: any ): Promise<void> {
  const apiCall: any = this as any;
  if (apiCall.extra) {
    apiCall.extra = await Encryption.encryptWithSalt(JSON.stringify(apiCall.extra), apiCall.businessId);
  }

  next();
});

ApiCallSchema.post('save', async (doc: any, next: any ) => {
  next();
});

ApiCallSchema.post(/^(find|findById|findOne)/, async (doc: any ) => {
  if (doc?.extra && (typeof doc.extra === 'string')) {
    doc.extra = await Encryption.decryptWithSalt(doc.extra, doc.businessId);
    doc.extra = JSON.parse(doc.extra);
  }
});
