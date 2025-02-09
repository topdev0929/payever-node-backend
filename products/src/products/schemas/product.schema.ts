// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';
import { ProductShippingSchema } from './product-shipping.schema';
import { MarketplaceAssigmentSchemaName } from '../../marketplace';
import { CategorySchemaName, CollectionSchemaName } from '../../categories/schemas';
import { categorySchema } from '../../categories/category.schema';
import { optionSchema } from './option.schema';
import { ProductPriceSchema } from './product-price.schema';
import { ProductAttributeSchema } from '../../new-products/schemas/product-attribute.schema';
import { VariationAttributeSchema } from '../../new-products/schemas/variation-attribute.schema';
import { ChannelSetSchemaName } from '../../channel-set/schemas';
import { AlbumSchemaName } from '../../album/schemas';
import { ProductModel } from '../models';
import { ProductDeliverySchema } from './product-delivery.schema';
import { ProductConditionEnum } from '../enums';

export const ProductSchemaName: string = 'Product';
export const ProductSchema: Schema<ProductModel> = new Schema<ProductModel>(
  {
    apps: [String],
    active: {
      default: true,
      type: Boolean,
    },
    album: { type: String, ref: AlbumSchemaName },
    barcode: String,
    brand: String,
    condition: {
      enum: Object.values(ProductConditionEnum),
      type: String,
    },
    businessId: {
      index: true,
      required: true,
      type: String,
    },
    channelSetCategories: { type: Schema.Types.Mixed, default: [] },
    categories: [categorySchema],
    category: { ref: CategorySchemaName, type: String },
    collections: [{ ref: CollectionSchemaName, type: String }],
    company: String,
    channelSets: [{ ref: ChannelSetSchemaName, type: String }],
    country: String,
    currency: String,
    deliveries: {
      default: [],
      type: [ProductDeliverySchema],
    },
    description: {
      type: String,
    },
    ean: String,
    options: [optionSchema],
    images: [String],
    imagesUrl: [String],
    importedId: String,
    language: String,
    dropshipping: {
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
    shipping: ProductShippingSchema,
    seo: { title: String, description: String },
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
    variants: [
      {
        ref: 'Variant',
        type: String,
      },
    ],
    vatRate: Number,
    example: {
      default: false,
      type: Boolean,
    },
    attributes: [ProductAttributeSchema],
    variantAttributes: [VariationAttributeSchema],
    videos: [String],
    videosUrl: [String],
    origin: String,
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
)
  .index({ collections: 1 })
  .index({ channelSets: 1 })
  .index({ _id: 1, businessId: 1 })
  .index({ businessId: 1, sku: 1 })
  .index({ businessId: 1, example: 1 })
  .index({ businessId: 1, slug: 1 }, { unique: true })
  .index({ businessId: 1, importedId: 1 })
  ;

ProductSchema.virtual('marketplaceAssigments', {
  foreignField: 'productUuid',
  localField: '_id',
  ref: MarketplaceAssigmentSchemaName,
});

// For backwards compatibility
ProductSchema.virtual('uuid').get(function (): string {
  return this._id;
});

// For backwards compatibility
ProductSchema.virtual('hidden').get(function (): boolean {
  return !this.onSales;
});

// For backwards compatibility
ProductSchema.virtual('enabled').get(function (): boolean {
  return this.active;
});

// For backwards compatibility
ProductSchema.virtual('businessUuid').get(function (): string {
  return this.businessId;
});

ProductSchema.virtual('originalProduct', {
  foreignField: '_id',
  localField: 'importedId',
  justOne: true,
  ref: ProductSchemaName,
});

const autoPopulate: (next: any) => void = function (next: any): void {
  this.populate('channelSets');
  next();
};

ProductSchema
  .pre('findOne', autoPopulate)
  .pre('find', autoPopulate)
  .pre('remove', autoPopulate);
