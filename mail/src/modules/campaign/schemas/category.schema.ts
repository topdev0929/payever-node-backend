import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import * as mongooseIdPlugin from 'mongoose-id';
import { BusinessSchemaName } from '../../mongoose-schema/mongoose-schema.names';

export const CategorySchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    business: {
      ref: BusinessSchemaName,
      required: true,
      type: String,
    },
    description: String,
    name: {
      required: true,
      type: String,
    },
  },
  { timestamps: true },
)
    .index({ business: 1 })
;

CategorySchema.plugin(mongooseIdPlugin);
