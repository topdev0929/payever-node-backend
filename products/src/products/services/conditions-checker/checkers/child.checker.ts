import { CheckerInterface } from './checker.interface';
import { FilterInterface } from '../../../../common/interfaces/filter.interface';
import { PopulatedVariantsCategoryCollectionsChannelSetProductModel, ProductModel } from '../../../models';
import { ServiceTagsEnum } from '../../../enums';
import { FilterFieldTypeEnum, StringFieldConditionEnum } from '../../../../common/enums';
import { ConditionsChecker } from '../conditions.checker';
import { ServiceTag } from '@pe/nest-kit';
import { Injectable } from '@nestjs/common';

@Injectable()
@ServiceTag(ServiceTagsEnum.ConditionsChecker)
export class ChildChecker implements CheckerInterface {

  constructor(
    private readonly conditionsChecker: ConditionsChecker,
  ) { }

  public doesSupport(filter: FilterInterface): boolean {
    return filter.fieldType === FilterFieldTypeEnum.Child;
  }

  public async doesSatisfy(
    product: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
    filter: FilterInterface,
  ): Promise<boolean> {
    let doesChildFiltersSatisfy: boolean;
    const childValues: any[] = Array.isArray(product[filter.field])
      ? product[filter.field]
      : [product[filter.field]];

    for (const childFilter of filter.filters) {
      doesChildFiltersSatisfy = doesChildFiltersSatisfy === undefined
        ? await this.doesChildFilterSatisfy(childValues, childFilter)
        : doesChildFiltersSatisfy && await this.doesChildFilterSatisfy(childValues, childFilter);
    }

    return filter.fieldCondition === StringFieldConditionEnum.IsNot
      ? !doesChildFiltersSatisfy
      : doesChildFiltersSatisfy;
  }

  private async doesChildFilterSatisfy(values: ProductModel[], filter: FilterInterface): Promise<boolean> {
    for (const value of values) {
      if (await this.conditionsChecker.doesSatisfy(value, filter)) {
        return true;
      }
    }

    return false;
  }
}
