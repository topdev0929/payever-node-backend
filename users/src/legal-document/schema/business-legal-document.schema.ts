import { Schema } from 'mongoose';
import * as beautifyUnique from 'mongoose-beautiful-unique-validation';
import { v4 as uuid } from 'uuid';
import { BusinessSchemaName } from '../../user/schemas';

export const BusinessLegalDocumentSchemaName: string = 'BusinessLegalDocument';
export const BusinessLegalDocumentSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    business: {
      ref: BusinessSchemaName,
      type: String,
    },
    content: String,
    type: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: { },
  },
)
  .index({ type: 1, business: 1 }, { unique: true })
  .index({ business: 1 })
  .plugin(beautifyUnique, { defaultMessage: 'forms.error.validator.{PATH}.not_unique' });
