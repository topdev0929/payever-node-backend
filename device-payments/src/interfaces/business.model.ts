import { Document } from 'mongoose';
import { BusinessInterface } from './business.interface';

export interface BusinessModel extends BusinessInterface, Document {
  _id: any;
}
