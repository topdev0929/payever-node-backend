import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessSchemaName } from '../../business';
import { CategorySchema } from './category.schema';

export const ProductSchemaName: string = 'Product';

export const ProductSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    title: { type: String, required: true },

    active: { type: Boolean },
    album: { type: String },
    apps: [String],
    attributes: [Schema.Types.Mixed],
    barcode: String,
    businessUuid: { type: String },
    categories: [CategorySchema],
    category: CategorySchema,
    channelSets: [{ type: String }],
    collections: [{ type: String }],
    country: String,
    currency: String,
    description: { type: String },
    example: { type: Boolean },
    images: [String],
    imagesUrl: [String],
    salePrice: { type: Number },
    shipping: Schema.Types.Mixed,
    sku: { type: String },
    slug: {
      index: true,
      type: String,
    },
    type: { type: String },
    variantAttributes: [Schema.Types.Mixed],
    variants: [ { type: String } ],
    vatRate: Number,
    videos: [String],
    videosUrl: [String],
  },
  {
    collection: 'products',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ProductSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});
