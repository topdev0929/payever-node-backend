import { Document } from 'mongoose';
import { AttachmentInterface } from './attachment.interface';

export interface Template extends Document {
  use_layout: boolean;
  layout?: Template | string;
  locale: string;
  template_name: string;
  section: string;
  subject: string;
  template_type: string;
  body: string;
  description: string;
  attachments: [AttachmentInterface];
}
