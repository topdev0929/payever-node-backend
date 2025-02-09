// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';
import * as beautifyUnique from 'mongoose-beautiful-unique-validation';
import { CategoryAttributeSchema } from './category-attribute.schema';
import { v4 as uuid } from 'uuid';

export const CategorySchemaName: string = 'Category';
export const CategorySchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    parent: { type: String, ref: CategorySchemaName },
    ancestors: [{ type: String, ref: CategorySchemaName }],
    businessId: {
      type: String,
      required: true,
    },
    image: String,
    name: String,
    attributes: [CategoryAttributeSchema],
    slug: String,
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
)
  .index({ ancestors: 1 })
  .index({ name: 1, parent: 1, businessId: 1 }, { unique: true })
  .index({ slug: 1, parent: 1, businessId: 1 }, { unique: true })
  .index({ _id: 1, businessId: 1 })
  .index({ name: 1, businessId: 1 })
  .plugin(beautifyUnique, { defaultMessage: 'forms.error.validator.{PATH}.not_unique' });

CategorySchema.virtual('id').get(function (): string {
  return this._id;
});

CategorySchema.virtual('title').get(function (): string {
  return this.name;
});

CategorySchema.virtual('businessUuid').get(function (): string {
  return this.businessId;
});
