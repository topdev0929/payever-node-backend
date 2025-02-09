import { Document } from 'mongoose';
import { ContactInterface } from '@pe/message-kit';

export interface ContactDocument extends ContactInterface, Document {
  _id: string;
  business: string;
  bot?: string;
}
