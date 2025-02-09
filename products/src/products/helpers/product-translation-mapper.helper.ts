import { PopulatedVariantsCategoryCollectionsChannelSetProductModel, ProductModel } from '../models';
import { TranslationInterface } from '../interfaces';
import { FIX_MISTYPING } from 'src/special-types';

export class ProductTranslationMapperHelper {
  public static toTranslation(
    product: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ): TranslationInterface {
    return {
      attributes: product.attributes,
      categories: product.categories,
      category: product.category as FIX_MISTYPING,
      collections: product.collections as FIX_MISTYPING,
      description: product.description,
      images: product.images,
      imagesUrl: product.imagesUrl,
      title: product.title,
      variantAttributes: product.variantAttributes,
      variants: product.variants as FIX_MISTYPING,
      videos: product.videos,
      videosUrl: product.videosUrl,
    };
  }
}
