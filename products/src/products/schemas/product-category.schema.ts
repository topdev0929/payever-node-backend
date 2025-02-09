// DEPRECATED: use the one on categories module

// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';

export const ProductCategorySchema: Schema = new Schema(
  {
    businessId: {
      type: Schema.Types.String,
      required: true,
    },
    title: {
      type: Schema.Types.String,
      required: true,
      index: true,
    },
    slug: {
      type: Schema.Types.String,
      required: true,
      index: true,
    },
  },
  { toObject: { virtuals: true } },
)

  .index({ businessId: 1 })
  .index({ title: 1, businessId: 1 }, { unique: true })
  .index({ slug: 1, businessId: 1 }, { unique: true });

// For backwards compatibility
ProductCategorySchema.virtual('businessUuid').get(function (): string {
  return this.businessId;
});
