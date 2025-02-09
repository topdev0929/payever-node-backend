import { Document } from 'mongoose';
import { SignupsInterface } from './signups.interface';

export interface SignupModel extends SignupsInterface, Document {
  baseCrmContactId?: number;
  createdAt: Date;
  updatedAt: Date;
}
