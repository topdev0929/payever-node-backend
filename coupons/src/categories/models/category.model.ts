import { CategoryInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface CategoryModel extends CategoryInterface, Document {
  parent: CategoryInterface;
  ancestors: CategoryInterface[];
}

