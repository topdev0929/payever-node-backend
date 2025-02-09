import { CategoryInterface } from './category.interface';
import { Document } from 'mongoose';

export interface CategoryDocument extends CategoryInterface, Document<string> {
  _id: string;
}
