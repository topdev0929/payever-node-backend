import { PopulatedVariantsCategoryCollectionsChannelSetProductModel, ProductModel } from '../../../models';
import { FilterInterface } from '../../../../common/interfaces/filter.interface';
import { ServiceTagsEnum } from '../../../enums';
import { FilterFieldTypeEnum, NumberFieldConditionEnum } from '../../../../common/enums';
import { ValueExtractorHelper } from '../value-extractor.helper';
import { CheckerInterface } from './checker.interface';
import { ServiceTag } from '@pe/nest-kit';
import { Injectable } from '@nestjs/common';

@Injectable()
@ServiceTag(ServiceTagsEnum.ConditionsChecker)
export class LessThanChecker implements CheckerInterface {
  public doesSupport(filter: FilterInterface): boolean {
    return FilterFieldTypeEnum.Number === filter.fieldType
      && filter.fieldCondition === NumberFieldConditionEnum.LessThan;
  }

  public async doesSatisfy(
    product: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
    filter: FilterInterface,
  ): Promise<boolean> {
    const value: any = ValueExtractorHelper.getValueByPath(filter.field, product);

    if (value === undefined && value === null) {
      return false;
    }

    return Number(value) < Number(filter.value);
  }
}
