import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import * as mongooseIdPlugin from 'mongoose-id';
import { BusinessSchemaName } from '../../mongoose-schema/mongoose-schema.names';

export const ContactSchema: Schema = new Schema(
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
    contacts: [String],
  },
  { timestamps: true },
)
    .index({ business: 1 })
;

ContactSchema.plugin(mongooseIdPlugin);
