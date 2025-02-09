// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';
import * as beautifyUnique from 'mongoose-beautiful-unique-validation';
import { CategoryAttributeSchema } from './category-attribute.schema';
import { v4 as uuid } from 'uuid';

export const DefaultCategorySchemaName: string = 'DefaultCategory';
export const DefaultCategorySchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    parent: { type: String, ref: DefaultCategorySchemaName },
    ancestors: [{ type: String, ref: DefaultCategorySchemaName}],
    path: String,
    name: String,
    attributes: [CategoryAttributeSchema],
    slug: String,
  },
  { timestamps: true },
);

DefaultCategorySchema.index({ ancestors: 1});

DefaultCategorySchema.index(
  {
    name: 1,
    parent: 1,
  },
  {
    unique: true,
  },
).plugin(beautifyUnique, { defaultMessage: 'forms.error.validator.{PATH}.not_unique' });

DefaultCategorySchema.index(
  {
    slug: 1,
    parent: 1,
  },
  {
    unique: true,
  },
)
.plugin(beautifyUnique, { defaultMessage: 'forms.error.validator.{PATH}.not_unique' });
