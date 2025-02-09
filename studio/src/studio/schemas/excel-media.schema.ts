import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const ExcelMediaSchemaName: string = 'ExcelMedia';
export const ExcelMediaSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    age: { type: Schema.Types.String },
    area: [{ type: Schema.Types.String }],
    background: { type: Schema.Types.String },
    body: { type: Schema.Types.String },
    color: { type: Schema.Types.String },
    decade: { type: Schema.Types.String },
    format: { type: Schema.Types.String },
    hasPeople: { type: Schema.Types.Boolean },
    isDeleted: { type: Schema.Types.Boolean },
    kind: { type: Schema.Types.String },
    location: { type: Schema.Types.String },
    material: { type: Schema.Types.String },
    mediaNumber: { type: Schema.Types.String },
    nationality: { type: Schema.Types.String },
    path: { type: Schema.Types.String },
    people: { type: Schema.Types.String },
    productCategory: { type: Schema.Types.String },
    quality: { type: Schema.Types.String },
    season: { type: Schema.Types.String },
    size: { type: Schema.Types.Mixed },
    source: { type: Schema.Types.String },
    styles: [{ type: Schema.Types.String }],
    tags: [{ type: Schema.Types.String }],
    themeCategory: { type: Schema.Types.String },
    type: { type: Schema.Types.String },
    version: { type: Schema.Types.Number },
  },
  { timestamps: true },
).index({ path: 1 }, { unique: true });
