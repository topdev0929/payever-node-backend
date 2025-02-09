import { ProductBaseInterface } from './product-base.interface';
import { CategoryInterface } from '../../categories/category.interface';
import { ChannelSetInterface } from '../../channel-sets/channel-set.interface';
import { ShippingInterface } from '../../shipping/shipping.interface';
import { VariantInterface } from '../../variants/interfaces/variant.interface';
import { ProductAttributeInterface } from './product-attribute.interface';
import { VariationAttributeInterface } from './variation-attribute.interface';

export interface ProductInterface extends ProductBaseInterface {
  active: boolean;
  slug?: string;
  title: string;
  type: string;

  barcode: string;
  description: string;
  images: string[];
  imagesUrl: string[];
  videos?: string[];
  videosUrl?: string[];
  onSales: boolean;
  price: number;
  salePrice: number;

  country?: string;
  currency?: string;
  vatRate?: number;

  categories: CategoryInterface[];
  channelSets: ChannelSetInterface[];
  shipping: ShippingInterface;
  variants: VariantInterface[];

  attributes: ProductAttributeInterface[];
  variantAttributes: VariationAttributeInterface[];

  example: boolean;

  /** @deprecated */
  enabled?: boolean;

  /** @deprecated */
  hidden?: boolean;
}
