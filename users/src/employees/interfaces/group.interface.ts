import { Document } from 'mongoose';
import { Employee } from '.';

export interface Group extends Document {
  name: string;
  businessId: string;
  employees?: Employee[] | string[];
  toObject: () => any;
}
