// tslint:disable:object-literal-sort-keys
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const CategoryMappingSchemaName: string = 'CategoryMapping';
export const CategoryMappingSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    path: String,
    keyIndex: Number,
  },
  { timestamps: true },
);

CategoryMappingSchema.index({ keyIndex: 1});
