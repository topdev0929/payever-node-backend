import { ProductCategoryInterface, ProductShippingInterface } from '../interfaces';
import { ProductMarketplaceInterface } from './product-marketplace.interface';
import { MarketplaceAssigmentInterface } from '../../marketplace/interfaces';
import { Types } from 'mongoose';
import { ProductVariantModel } from '../models/product-variant.model';
import { CategoryInterface, CollectionInterface } from '../../categories/interfaces';
import { ProductAttributeInterface } from './product-attribute.interface';
import { VariationAttributeInterface } from './variation-attribute.interface';

export interface TranslationInterface {
  attributes?: ProductAttributeInterface[];
  categories?: ProductCategoryInterface[];
  category?: CategoryInterface;
  collections?: CollectionInterface[];
  description?: string;
  images?: string[];
  imagesUrl?: string[];
  title?: string;
  variantAttributes?: VariationAttributeInterface[];
  variants?: Types.DocumentArray<ProductVariantModel>;
  videos?: string[];
  videosUrl?: string[];
}
