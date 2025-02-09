import { Document } from 'mongoose';

export interface BusinessModel extends Document {
  _id?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}
