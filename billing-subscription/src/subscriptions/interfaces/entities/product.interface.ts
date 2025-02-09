import { BusinessInterface } from '../../../business';
import { CategoryInterface } from './category.interface';

export interface ProductInterface {
  business?: BusinessInterface;
  businessId: string;
  price: number;
  title: string;
  image: string;

  // sync from product
  apps?: [string];
  active?: boolean;
  album?: string;
  barcode?: string;
  businessUuid?: string;
  categories?: [CategoryInterface];
  category?: CategoryInterface;
  collections?: [string];
  channelSets?: [string];
  country?: string;
  currency?: string;
  description?: string;
  images?: [string];
  imagesUrl?: [string];
  salePrice?: number;
  shipping?: any;
  slug?: string;
  sku?: string;
  type?: string;
  variants?: [ string ];
  vatRate?: number;
  example?: boolean;
  attributes?: [any];
  variantAttributes?: [any];
  videos?: [string];
  videosUrl?: [string];
}
