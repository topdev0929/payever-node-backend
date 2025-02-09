import { Document } from 'mongoose';
import { CategoryInterface } from '../../categories/interfaces';

export interface ProductCategoryModel extends CategoryInterface, Document {
  parent: CategoryInterface;
  ancestors: CategoryInterface[];
}
