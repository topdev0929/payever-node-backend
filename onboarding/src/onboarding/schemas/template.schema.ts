import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const TemplateSchemaName: string = 'Template';
export const TemplateSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    name: { type: String, required: true, unique: true },

    config: { type: Object, required: true },
  },
  {
    timestamps: { },
  },
);
