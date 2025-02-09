import { CollectionProductFilterInterface } from './collection-product-filter.interface';
import { ProductModel } from '../../products/models';

export interface AutomaticCollectionConditionsInterface {
  strict: boolean;
  filters: CollectionProductFilterInterface[];
  manualProductsList: ProductModel[];
}
