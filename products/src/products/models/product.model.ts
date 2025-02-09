// tslint:disable: max-union-size
import { Document, LeanDocument, Types } from 'mongoose';
import { ProductInterface } from '../interfaces';
import { CollectionModel, CategoryModel } from '../../categories/models';
import { ProductVariantModel } from './product-variant.model';
import { ChannelSetModel } from '../../channel-set';
import { InventoryInput } from '../graphql/graphql.schema';

export const ProductModelName: string = 'ProductModel';
export const ProductVariantModelName: string = 'ProductVariantModel';

export interface ProductModel extends ProductInterface, Document<string> {
  stock?: number;
  priceAndCurrency?: string;
  salePriceAndCurrency?: string;
  variantCount?: number;
  business?: {
    _id: string;
    companyAddress?: {
      country: string;
      city: string;
      street: string;
      zipCode: string;
    };
  };
  /** @deprecated */
  variants?: string[];

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly uuid?: string;
}

type PopulatedVariants = { variants: ProductVariantModel[] };
type PopulatedInventory = { inventory: InventoryInput };
type PopulatedCategory = { category: CategoryModel };
type PopulatedCategoryWithAncestors = {
  category: Omit<CategoryModel, 'ancestors'> & {
    ancestors: Types.DocumentArray<CategoryModel>;
  };
};
type PopulatedCollections = {
  collections: Types.DocumentArray<CollectionModel>;
};
type PopulatedChannelSets = {
  channelSets: Types.DocumentArray<ChannelSetModel>;
};

export type PopulatedCollectionsCategoryVariantsProductModel =
  Omit<ProductModel, 'collections' | 'category' | 'variants'> &
  PopulatedCollections &
  PopulatedCategory &
  PopulatedVariants;

export type PopulatedVariantsCategoryProductModel =
  Omit<ProductModel, 'variants' | 'category'> &
  PopulatedVariants &
  PopulatedCategoryWithAncestors;

export type PopulatedVariantsCategoryCollectionsChannelSetProductModel =
  Omit<ProductModel, 'variants' | 'category' | 'collections' | 'channelSets'> &
  PopulatedVariants &
  PopulatedCategory &
  PopulatedCollections &
  PopulatedInventory &
  PopulatedChannelSets;

export type PopulatedVariantsProductModel =
  Omit<ProductModel, 'variants'> &
  PopulatedVariants;

export type PopulatedVariantsCollectionsProductModel =
  Omit<ProductModel, 'variants' | 'collections'> &
  PopulatedVariants &
  PopulatedCollections;

export type PopulatedVariantsLeanProduct =
  LeanDocument<Omit<ProductModel, 'variants'>> &
  {
    variants: Array<LeanDocument<ProductVariantModel>>;
  };

type PopulatedProductVariants =
  PopulatedCollectionsCategoryVariantsProductModel |
  PopulatedVariantsCategoryProductModel |
  PopulatedVariantsCategoryCollectionsChannelSetProductModel |
  PopulatedVariantsProductModel |
  PopulatedVariantsCollectionsProductModel;

export function isObjectAProductModel(object: any): object is ProductModel | PopulatedProductVariants {
  return ((object as ProductModel).constructor as any).modelName === 'Product';
}
