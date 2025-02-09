import { PopulatedVariantsCategoryCollectionsChannelSetProductModel, ProductModel } from '../../../models';
import { FilterInterface } from '../../../../common/interfaces/filter.interface';
import { ServiceTagsEnum } from '../../../enums';
import { FilterFieldTypeEnum, StringFieldConditionEnum } from '../../../../common/enums';
import { ValueExtractorHelper } from '../value-extractor.helper';
import { CheckerInterface } from './checker.interface';
import { ServiceTag } from '@pe/nest-kit';
import { Injectable } from '@nestjs/common';

@Injectable()
@ServiceTag(ServiceTagsEnum.ConditionsChecker)
export class IsChecker implements CheckerInterface {
  public doesSupport(filter: FilterInterface): boolean {
    return [FilterFieldTypeEnum.String, FilterFieldTypeEnum.Number].indexOf(filter.fieldType) !== -1
      && filter.fieldCondition === StringFieldConditionEnum.Is;
  }

  public async doesSatisfy(
    product: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
    filter: FilterInterface,
  ): Promise<boolean> {
    return ValueExtractorHelper.getValueByPath(filter.field, product) === filter.value;
  }
}
