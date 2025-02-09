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
export class EndsWithChecker implements CheckerInterface {
  public doesSupport(filter: FilterInterface): boolean {
    return FilterFieldTypeEnum.String === filter.fieldType
      && filter.fieldCondition === StringFieldConditionEnum.EndsWith;
  }

  public async doesSatisfy(
    product: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
    filter: FilterInterface,
  ): Promise<boolean> {
    const regexp: RegExp = new RegExp(`${filter.value}$`, 'i');

    return regexp.test(ValueExtractorHelper.getValueByPath(filter.field, product));
  }
}
