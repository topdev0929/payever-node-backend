// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';
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
  .index({ name: 1, businessId: 1 });

CategorySchema.virtual('id').get(function (): string {
  return this._id;
});

CategorySchema.virtual('title').get(function (): string {
  return this.name;
});

CategorySchema.virtual('businessUuid').get(function (): string {
  return this.businessId;
});
