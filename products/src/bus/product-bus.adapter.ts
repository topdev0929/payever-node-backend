// tslint:disable: max-union-size
import { ProductExportBusDTO } from './product-export-bus.dto';
import { OptionInterface } from '../products/interfaces/option.interface';
import { Injectable } from '@nestjs/common';
import { ProductAttributeInterface } from '../products/interfaces';
import {
  PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  PopulatedVariantsLeanProduct,
  PopulatedVariantsProductModel,
  ProductModel,
} from '../products/models';
import { LeanProductVariant, ProductVariantModel } from 'src/products/models/product-variant.model';
import { FIX_MISTYPING } from 'src/special-types';

export type WithToObject<T> = T & {
  toObject(): T;
};

@Injectable()
export class ProductBusAdapter {
  public fromVariant(
    product: ProductModel |
      PopulatedVariantsLeanProduct |
      PopulatedVariantsCategoryCollectionsChannelSetProductModel |
      PopulatedVariantsProductModel,
    variant: ProductVariantModel | LeanProductVariant,
  ): ProductExportBusDTO {
    return {
      _id: variant._id,
      active: product.active,
      attributes: variant.attributes,
      barcode: variant.barcode,
      businessId: variant.businessId,
      businessUuid: variant.businessId,
      categories: product.categories,
      channelSets: product.channelSets,
      country: product.country,
      currency: product.currency,
      description: variant.description,
      enabled: (product as FIX_MISTYPING).enabled,
      hidden: (variant as FIX_MISTYPING).hidden,
      id: variant.id,
      images: variant.images,
      imagesUrl: variant.imagesUrl,
      options: variant.options,
      parent: variant.product,
      price: variant.price,
      sale: variant.sale,

      onSales: variant.sale?.onSales,
      saleEndDate: variant.sale?.saleEndDate ? variant.sale?.saleEndDate.toISOString() : null,
      salePrice: variant.sale?.salePrice,
      saleStartDate: variant.sale?.saleStartDate ? variant.sale?.saleStartDate.toISOString() : null,

      shipping: product.shipping,
      sku: variant.sku,
      title: this.getVariantTitle(variant) || product.title,
      type: product.type,
      uuid: (variant as FIX_MISTYPING).uuid,
      vatRate: product.vatRate,
    };
  }

  public getVariantTitle(vi: ProductVariantModel | LeanProductVariant): string {

    if (Array.isArray(vi.attributes)) {
      const attribute: ProductAttributeInterface = vi.attributes.find((x: ProductAttributeInterface) => x.name === 'name');

      return attribute && attribute.value;
    }

    if (Array.isArray(vi.options)) {
      const opt: OptionInterface = vi.options.find((x: OptionInterface) => x.name === 'name');

      return opt && opt.value;
    }
  }

  public wrapObject<T>(o: T): WithToObject<T> {
    return Object.assign(o, { toObject: (): T => o });
  }

  public processProductVariants(
    // tslint:disable-next-line: max-union-size
    product: ProductModel |
      PopulatedVariantsLeanProduct |
      PopulatedVariantsCategoryCollectionsChannelSetProductModel |
      PopulatedVariantsProductModel,
    variants: Array<ProductVariantModel | LeanProductVariant>,
    callback: (p: WithToObject<ProductExportBusDTO>) => void,
  ): void {
    if (Array.isArray(variants)) {
      for (const vt of variants) {
        const pr: ProductExportBusDTO = this.fromVariant(product, vt);
        callback(this.wrapObject(pr));
      }
    }
  }
}
