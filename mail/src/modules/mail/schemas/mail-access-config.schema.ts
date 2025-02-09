import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { MailSchemaName } from '../../mongoose-schema/mongoose-schema.names';

export const MailAccessConfigSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    internalDomain: { type: String },
    internalDomainPattern: { type: String },
    isLive: { type: Boolean, default: true },
    isLocked: { type: Boolean },
    mail: { type: Schema.Types.String, required: true, ref: MailSchemaName },
    version: {
      type: String,
    },
  },
  {
    timestamps: { },
  },
)
  .index({ internalDomain: 1 }, { unique: true })
  .index({ internalDomainPattern: 1 }, { unique: true })
  .index({ mail: 1 })
  .index({ internalDomain: 1 });
