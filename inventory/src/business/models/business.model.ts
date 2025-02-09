import { Document } from 'mongoose';
import { BusinessInterface } from '@pe/business-kit';

export interface BusinessModel extends BusinessInterface, Document {
  name: string;
}
