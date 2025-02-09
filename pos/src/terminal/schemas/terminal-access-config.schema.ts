import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { TerminalSchemaName } from '../../mongoose-schema/mongoose-schema.names';

export const TerminalAccessConfigSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    internalDomain: { type: String, unique: true },
    internalDomainPattern: { type: String },
    isLive: { type: Boolean, default: true },
    isLocked: { type: Boolean },
    terminal: { type: Schema.Types.String, required: true, ref: TerminalSchemaName },
    version: {
      type: String,
    },
  },
  {
    timestamps: { },
  },
)
  .index({ internalDomainPattern: 1 })
  .index({ terminal: 1 })
  .index({ internalDomain: 1 });
