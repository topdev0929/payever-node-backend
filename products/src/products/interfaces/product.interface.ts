import { ProductTypeEnum, ProductConditionEnum } from '../enums';
import { OptionInterface } from './option.interface';
import { ProductAttributeInterface } from './product-attribute.interface';
import { ProductCategoryInterface } from './product-category.interface';
import { ProductMarketplaceInterface } from './product-marketplace.interface';
import { ProductPriceInterface } from './product-price.interface';
import { ProductShippingInterface } from './product-shipping.interface';
import { VariationAttributeInterface } from './variation-attribute.interface';
import { MarketplaceAssigmentInterface } from '../../marketplace/interfaces';
import { ProductSeoInterface } from './product-seo.interface';
import { ProductDeliveryInterface } from './product-delivery.interface';
import { ProductSaleInterface } from './product-sale.interface';
import { ProductChannelSetCategoriesInterface } from './product-channel-set-categories.interface';


export interface ProductInterface {
  active: boolean;
  album?: string;
  apps?: string[];
  barcode: string;
  brand?: string;
  condition?: ProductConditionEnum;
  businessId: string;
  channelSetCategories?: ProductChannelSetCategoriesInterface[];
  categories: ProductCategoryInterface[];
  category?: string;
  company?: string;
  collections: string[];
  // Could always be document because of pre-autoPopulate
  channelSets?: string[];
  country?: string;
  currency?: string;
  deliveries?: ProductDeliveryInterface[];
  description: string;
  dropshipping?: boolean;
  ean: string;
  example: boolean;
  images: string[];
  imagesUrl: string[];
  importedId?: string;
  /** @warn not exists in schema */
  isLocked?: boolean;
  language?: string;
  marketplaceAssigments?: MarketplaceAssigmentInterface[];
  marketplaces?: ProductMarketplaceInterface[];


  /** @deprecated */
  options: OptionInterface[];
  origin: string;
  attributes: ProductAttributeInterface[];
  variantAttributes: VariationAttributeInterface[];
  price: number;
  priceTable?: ProductPriceInterface[];
  sale?: ProductSaleInterface;
  seo: ProductSeoInterface;
  shipping?: ProductShippingInterface;
  sku: string;
  slug?: string;
  title: string;
  type: ProductTypeEnum;
  variants?: string[];
  vatRate?: number;
  videos?: string[];
  videosUrl?: string[];
}
