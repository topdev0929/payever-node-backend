import { Schema } from 'mongoose';

export const ProductRecommendationsSchema: Schema = new Schema(
  {
    businessId: {
      required: true,
      type: Schema.Types.String,
    },
    productId: {
      required: true,
      type: Schema.Types.String,
    },
    recommendations: [
      {
        _id: false,
        id: String,
        images: [String],
        name: String,
      },
    ],
    sku: {
      required: true,
      type: Schema.Types.String,
    },
    tag: {
      enum: [ 'byCategory', 'byCollection', 'IndividualProduct' ],
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

ProductRecommendationsSchema.index({ businessId : 1, sku : 1 }, { unique: true });
ProductRecommendationsSchema.index({ productId : 1 }, { unique: true });

// For backwards compatibility
ProductRecommendationsSchema.virtual('businessUuid').get(function (): string {
  return this.businessId;
});
