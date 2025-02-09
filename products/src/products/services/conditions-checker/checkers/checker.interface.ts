import { FilterInterface } from '../../../../common/interfaces/filter.interface';
import { PopulatedVariantsCategoryCollectionsChannelSetProductModel, ProductModel } from '../../../models';

export interface CheckerInterface {
  doesSupport(filter: FilterInterface): boolean;
  doesSatisfy(
    product: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
    filter: FilterInterface,
  ): Promise<boolean>;
}
