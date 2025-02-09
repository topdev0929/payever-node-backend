// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';
import { categorySchema } from '../../categories/category.schema';
import { shippingSchema } from '../../shipping/shipping.schema';
import { CategorySchemaName, CollectionSchemaName } from '../../categories/schemas';
import { ProductAttributeSchema } from './product-attribute.schema';
import { VariationAttributeSchema } from './variation-attribute.schema';
import { ChannelSetSchemaName } from '../../channel-set/schemas';
import { ProductPriceSchema } from '../../products/schemas/product-price.schema';

export const productSchema: Schema = new Schema(
  {
    active: {
      default: true,
      type: Boolean,
    },
    apps: [String],
    slug: {
      index: true,
      type: String,
    },
    title: {
      index: true,
      required: true,
      type: String,
    },
    type: {
      enum: ['digital', 'physical', 'service'],
      type: String,
    },

    barcode: String,
    description: String,
    images: [String],
    imagesUrl: [String],
    videos: [String],
    videosUrl: [String],
    onSales: {
      default: false,
      type: Boolean,
    },
    price: {
      index: true,
      required: true,
      type: Number,
    },
    priceTable: {
      default: [],
      type: [ProductPriceSchema],
    },
    salePrice: {
      type: Number,
    },

    country: String,
    currency: String,
    vatRate: Number,
    categories: [categorySchema],
    channelSets: [{ ref: ChannelSetSchemaName, type: String }],
    shipping: shippingSchema,
    category: { ref: CategorySchemaName, type: String },
    collections: [{ ref: CollectionSchemaName, type: String }],
    attributes: [ProductAttributeSchema],
    variantAttributes: [VariationAttributeSchema],
    example: {
      default: false,
      type: Boolean,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

/** @deprecated */
productSchema.virtual('hidden').get(function(): boolean {
  return !this.onSales;
});

/** @deprecated */
productSchema.virtual('enabled').get(function(): boolean {
  return this.active;
});

/** @deprecated */
productSchema.virtual('businessUuid').get(function(): string {
  return this.businessId;
});
