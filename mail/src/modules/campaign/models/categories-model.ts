import { CategoryModel } from './category-model';
import { Info } from '../classes';

export interface CategoriesModel {
  categories: CategoryModel[];
  info: Info;
}
