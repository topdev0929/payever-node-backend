import { Document } from 'mongoose';

export interface ContactModel extends Document {
  fields: Array<{ name: string; value: string }>;
}
