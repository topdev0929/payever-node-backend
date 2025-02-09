import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { BlogSchemaName } from '../../mongoose-schema/mongoose-schema.names';

export const BlogPageSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    author: { type: String },
    blog: { type: Schema.Types.String, required: true, ref: BlogSchemaName },
    body: { type: String },
    caption: { type: String },
    date: { type: Date },
    description: { type: String },
    image: { type: String },
    pageId: { type: String, required: true },
    subtitle: { type: String },
    title: { type: String },
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
