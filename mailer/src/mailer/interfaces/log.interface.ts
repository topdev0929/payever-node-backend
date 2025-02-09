import { Document } from 'mongoose';

export interface Log extends Document {
  from: string;
  to: string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
}
