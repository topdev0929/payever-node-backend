import { Document } from 'mongoose';
import { CategoryInterface } from '../interfaces/entities';

export interface CategoryModel extends CategoryInterface, Document {
  _id: string;
}
