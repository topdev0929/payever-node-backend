import { Schema } from 'mongoose';
import { AmountSchema } from './amount.schema';
import { CustomWidgetSettingSchema } from './custom-widget-setting.schema';

export const PaymentOptionSchema: Schema = new Schema(
  {
    amountLimits: AmountSchema,
    connectionId: { type: String, required: false },
    enabled: Boolean,
    isBNPL: { type: Boolean, default: false },
    paymentMethod: String,
    productId: { type: String, required: false },
    customWidgetSetting: CustomWidgetSettingSchema,
  },
);
