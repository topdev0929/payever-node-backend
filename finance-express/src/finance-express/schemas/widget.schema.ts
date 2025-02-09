import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { AmountSchema } from './amount.schema';
import { BusinessSchemaName } from '../../business';
import { ChannelSetSchemaName } from '@pe/channels-sdk';
import Mixed = Schema.Types.Mixed;
import { PaymentOptionSchema } from './payment-option.schema';

export const WidgetSchemaName: string = 'Widget';
export const WidgetSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    amountLimits: AmountSchema,
    businessId: { type: String },
    channelSet: { type: String, required: true, ref: ChannelSetSchemaName },
    checkoutId: { type: String, required: true },
    checkoutMode: { type: String, required: true },
    checkoutPlacement: String,
    alignment: String,
    theme: String,
    connectionId: { type: String },
    isVisible: Boolean,
    maxWidth: Number,
    minWidth: Number,
    maxHeight: Number,
    minHeight: Number,
    payments: [PaymentOptionSchema],
    ratesOrder: String,
    styles: Mixed,
    type: { type: String, required: true },

    cancelUrl: { type: String, required: false },
    failureUrl: { type: String, required: false },
    noticeUrl: { type: String, required: false },
    pendingUrl: { type: String, required: false },
    successUrl: { type: String, required: false },
  },
)
  .index({ businessId: 1 })
  .index({ businessId: 1, checkoutId: 1 })
  .index({ businessId: 1, checkoutId: 1, type: 1 })
  .index({ businessId: 1, 'payments.paymentMethod': 1 })
  ;

WidgetSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
