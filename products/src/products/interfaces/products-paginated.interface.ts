import { ProductModel } from '../models';

export interface ProductsPaginatedInterface<T = ProductModel> {
  products: T[];
  info: {
    [propName: string]: any;
    pagination: {
      page: number;
      page_count: number;
      per_page: number;
      item_count: number;
    };
  };
}
