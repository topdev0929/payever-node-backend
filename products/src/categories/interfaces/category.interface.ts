import { CategoryAttributeInterface } from './category-attribute.interface';

export interface CategoryInterface {
  businessId: string;
  description?: string;
  parent?: CategoryInterface;
  ancestors?: CategoryInterface[];
  name: string;
  title?: string;
  slug: string;
  image?: string;
  attributes?: CategoryAttributeInterface[];
}
