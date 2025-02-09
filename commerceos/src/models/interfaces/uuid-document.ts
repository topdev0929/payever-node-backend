import { Document } from 'mongoose';

export interface UuidDocument extends Document {
  _id: string;
}
