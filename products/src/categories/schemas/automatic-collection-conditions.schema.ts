// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';
import { CollectionProductFilterSchema } from './collection-product-filter.schema';

export const AutomaticCollectionConditions: Schema = new Schema({
  strict: { type: Boolean, default: true},
  manualProductsList: [{ type: String, ref: 'Product'}],
  filters: [CollectionProductFilterSchema],
});
