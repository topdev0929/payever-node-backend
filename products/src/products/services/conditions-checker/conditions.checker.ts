import { PopulatedVariantsCategoryCollectionsChannelSetProductModel, ProductModel } from '../../models';
import { FilterInterface } from '../../../common/interfaces/filter.interface';
import { CheckerInterface } from './checkers';
import { ServiceTagsEnum } from '../../enums';
import { Collector } from '@pe/nest-kit';
import { CollectorInterface } from '@pe/nest-kit/modules/collector-pattern/interfaces';

@Collector(ServiceTagsEnum.ConditionsChecker)
export class ConditionsChecker implements CollectorInterface {
  private checkers: CheckerInterface[] = [];

  public async doesSatisfy(
    product: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
    filter: FilterInterface,
  ): Promise<boolean> {
    const checker: CheckerInterface = this.findConditionsChecker(filter);

    return checker.doesSatisfy(product, filter);
  }

  public addService(checker: CheckerInterface): void {
    this.checkers.push(checker);
  }

  private findConditionsChecker(filter: FilterInterface): CheckerInterface {
    for (const checker of this.checkers) {
      if (checker.doesSupport(filter)) {
        return checker;
      }
    }

    throw new Error(`Checker for condition "${filter.fieldCondition}" and type "${filter.fieldType}" not found`);
  }
}
