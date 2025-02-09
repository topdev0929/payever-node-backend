// tslint:disable object-literal-sort-keys
import { Schema } from 'mongoose';

export const CategorySchemaName: string = 'Category';
export const CategorySchema: Schema = new Schema({
  _id: String,
  businessId: String,
  slug: String,
  title: String,
});
