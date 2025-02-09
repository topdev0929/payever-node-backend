import { CategoryAttributeInterface } from './category-attribute.interface';

export interface DefaultCategoryInterface {
  parent: DefaultCategoryInterface;
  ancestors: DefaultCategoryInterface[];
  name: string;
  slug: string;
  attributes: CategoryAttributeInterface[];
}
