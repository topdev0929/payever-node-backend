import {
  isObjectAProductModel,
  PopulatedCollectionsCategoryVariantsProductModel,
  PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ProductModel,
} from '../models';
import { ProductAttributeDto } from '../dto';
import { LeanProductVariant, ProductVariantModel } from '../models/product-variant.model';
import { ElasticProductRelationsEnum } from '../enums/elastic-product-relations.enum';
import { ProductDocumentLikeDto } from '../../bus/product-export-bus.dto';
import { ProductVariantInterface } from '../interfaces';
import { FIX_MISTYPING } from 'src/special-types';

export class ElasticProductConverter {
  public static productToElastic(
    // tslint:disable-next-line: max-union-size
    productModel: ProductModel |
      ProductDocumentLikeDto |
      PopulatedCollectionsCategoryVariantsProductModel |
      PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ): FIX_MISTYPING {
    const attributes: ProductAttributeDto[] =
      isObjectAProductModel(productModel) && Array.isArray(productModel.attributes) ?
      productModel.attributes.map((attribute: ProductAttributeDto) => ({
        name: attribute.name.toLowerCase(),
        type: attribute.type,
        value: attribute.value.toLowerCase(),
      }))
      : [];

    return {
      ...productModel.toObject(),
      ...{
        attributes,
        id: undefined,
        product_relations: {
          name: ElasticProductRelationsEnum.parentProduct,
        },
        variants: undefined,
      },
    };
  }

  public static variantToElastic(variantModel: ProductVariantModel): ProductVariantInterface {
    const attributes: ProductAttributeDto[] = variantModel.attributes
      ? variantModel.attributes.map((attribute: ProductAttributeDto) => ({
        name: attribute.name.toLowerCase(),
        type: attribute.type,
        value: attribute.value.toLowerCase(),
      }))
      : [];

    return {
      ...variantModel.toObject(),
      ...{
        attributes,
        id: undefined,
        product_relations: {
          name: ElasticProductRelationsEnum.variant,
          parent: variantModel.product,
        },
        variants: undefined,
      },
    };
  }

  private static toLong(value: number): number {
    return value ? Math.trunc(value * 100) : value;
  }

  private static formatDecimal(value: number): string {
    return value ? (Math.round(value * 100) / 100).toFixed(2) : '';
  }

  private static fromLong(value: number): number {
    return value ? value / 100 : value;
  }
}
