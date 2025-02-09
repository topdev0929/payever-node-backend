import { Document } from 'mongoose';
import { ApiLogInterface } from '../interface';

export interface ApiLogModel extends Document, ApiLogInterface {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}
