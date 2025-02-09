import { ProductRecommendationsInterface, ProductShippingInterface } from '../interfaces';

export interface CountrySettingInterface {
  active?: boolean;
  channelSets?: string[];
  currency?: string;
  onSales?: boolean;
  recommendations?: ProductRecommendationsInterface;
  price?: number;
  salePrice?: number;
  shipping?: ProductShippingInterface;
  vatRate?: number;
}
