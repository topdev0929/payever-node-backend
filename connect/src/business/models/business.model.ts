import { Document } from 'mongoose';

import { BusinessModel } from '@pe/business-kit';
import { BusinessInterface } from '../interfaces';

export interface BusinessModelLocal extends BusinessInterface, BusinessModel, Document {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  readonly country?: string;
}
