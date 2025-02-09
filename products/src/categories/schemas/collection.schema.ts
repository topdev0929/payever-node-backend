// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';
import * as uniqueValidator from '@yastech/mongoose-unique-validator';
import { v4 as uuid } from 'uuid';
import { AutomaticCollectionConditions } from './automatic-collection-conditions.schema';

export const CollectionSchemaName: string = 'Collection';
export const CollectionSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: {
      type: String,
      required: true,
    },
    description: String,
    image: String,
    name: String,
    slug: String,
    productCount: Number,
    channelSets: [String],
    activeSince: Date,
    activeTill: Date,
    automaticFillConditions: AutomaticCollectionConditions,
    ancestors: [{ type: String, ref: CollectionSchemaName }],
    parent: { type: String, ref: CollectionSchemaName },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

CollectionSchema.index({ businessId: 1 });
CollectionSchema.index({ _id: 1, businessId: 1 });
CollectionSchema.index({ name: 1, businessId: 1 }, { unique: true });
CollectionSchema.index({ slug: 1, businessId: 1 }, { unique: true });
CollectionSchema.plugin(uniqueValidator, { message: 'forms.error.validator.{PATH}.not_unique' });

// For backwards compatibility
CollectionSchema.virtual('business').get(function (): string {
  return this.businessId;
});
