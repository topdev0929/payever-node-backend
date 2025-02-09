import { DateStringHelper } from '../../converter';
import { FilterConditionEnum } from '@pe/common-sdk';
import { StringFilterInterface } from '../interfaces';

export class IsDateConditionFilter {
  public static getName(): string {
    return FilterConditionEnum.isDate;
  }

  public static apply(
    elasticFilters: any,
    field: string,
    _filter: StringFilterInterface,
  ): void {
    for (const value of _filter.value) {
      const condition: { } = {
        range: {
          [field]: {
            gte: DateStringHelper.getDateStart(value),
            lt: DateStringHelper.getTomorrowDateStart(value),
          },
        },
      };
      elasticFilters.must.push(condition);
    }
  }
}
