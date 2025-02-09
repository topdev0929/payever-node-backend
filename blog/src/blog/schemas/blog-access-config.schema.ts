import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BlogSchemaName } from '../../mongoose-schema/mongoose-schema.names';

export const BlogAccessConfigSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    blog: { type: Schema.Types.String, required: true, ref: BlogSchemaName },
    internalDomain: { type: String },
    internalDomainPattern: { type: String },
    isLive: { type: Boolean, default: true },
    isLocked: { type: Boolean },
    isPrivate: {
      default: false,
      required: true,
      type: Boolean,
    },
    ownDomain: { type: String },
    privateMessage: String,
    privatePassword: {
      type: String,
    },
    socialImage: {
      type: String,
    },
    version: {
      type: String,
    },
  },
  {
    timestamps: { },
  },
)
  .index({ blog: 1 })
  .index({ internalDomain: 1 })
  .index({ internalDomainPattern: 1 })
  ;
