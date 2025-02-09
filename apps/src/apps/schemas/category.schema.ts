import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const CategorySchemaName: string = 'Category';
export const CategorySchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    actionNames: {
      default: [],
      type: [String],
    },
    icon: {
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: { },
  },
);

CategorySchema.index({ name: 1 });
CategorySchema.index({ actionNames: 1 });
