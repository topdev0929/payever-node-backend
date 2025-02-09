import { ProductCategoryInterface } from './product-category.interface';

export interface ProductChannelSetCategoriesInterface {
  channelSetId: string;
  categories: ProductCategoryInterface[];
  channelSetType: string;
}
