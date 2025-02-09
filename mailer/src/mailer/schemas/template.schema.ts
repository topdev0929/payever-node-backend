import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { AttachmentSchema } from './attachment.schema';

export const TemplateSchemaName: string = 'email_templates';

export const TemplateSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    attachments: [AttachmentSchema],
    body: { type: String, required: true },
    description: { type: String, required: false },
    layout: { ref: TemplateSchemaName, type: String, required: false },
    locale: { type: String },
    section: { type: String, required: true },
    subject: { type: String, required: true },
    template_name: { type: String, required: true },
    template_type: { type: String, required: true },
    use_layout: { type: Boolean, required: true },
  },
  {
    collection: 'email_templates',
  },
).index({ template_name: 1, locale: 1 }, { unique: true });
