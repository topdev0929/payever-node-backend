import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { SubsectionSchema } from './section';

export const SectionSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  allowed_only_channels: [String],
  allowed_only_integrations: [String],
  code: String, // 'order' | 'address' | 'payment' | 'choosePayment' etc.
  defaultEnabled: Boolean, // if true then it will be shown by default and included into new checkouts
  excluded_channels: [String],
  excluded_integrations: [String],
  fixed: Boolean, // true if sections can not be removed from the checkout sections flow
  options: {
    skipButton: {
      required: false,
      type: Boolean,
    },
  },
  order: Number, // order for fixed sections.
  // or example before the Payment sections should be Order section - but between them can be other sections
  subsections: [SubsectionSchema],
})
  .index({ order: 1 });
