import { Schema } from 'mongoose';
import * as beautifyUnique from 'mongoose-beautiful-unique-validation';
import { v4 as uuid } from 'uuid';

export const BusinessAppInstallationSchemaName: string = 'BusinessAppInstallation';
export const BusinessAppInstallationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: String,
    code: String,
  },
  {
    timestamps: { },
  },
)
  .index({ businessId: 1, code: 1 }, { unique: true })
  .index({ businessId: 1 })
  .plugin(beautifyUnique, { defaultMessage: 'forms.error.validator.{PATH}.not_unique' });
