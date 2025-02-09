import { PopulatedVariantsCategoryCollectionsChannelSetProductModel } from '../models';
import { CountrySettingInterface, ProductRecommendationsInterface } from '../interfaces';
import { FIX_MISTYPING } from 'src/special-types';

export class ProductCountrySettingMapperHelper {
  public static map(
    product: PopulatedVariantsCategoryCollectionsChannelSetProductModel,
    recommendations: ProductRecommendationsInterface,
  ): CountrySettingInterface {
    return {
      active: product.active,
      channelSets: product.channelSets as FIX_MISTYPING,
      currency: product.currency,
      onSales: product.sale.onSales,
      price: product.price,
      recommendations: recommendations,
      salePrice: product.sale.salePrice,
      shipping: product.shipping,
      vatRate: product.vatRate,
    };
  }
}
