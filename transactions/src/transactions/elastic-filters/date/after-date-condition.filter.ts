import { DateStringHelper } from '../../converter';
import { FilterConditionEnum } from '@pe/common-sdk';
import { StringFilterInterface } from '../interfaces';

export class AfterDateConditionFilter {
  public static getName(): string {
    return FilterConditionEnum.afterDate;
  }

  public static apply(
    elasticFilters: any,
    field: string,
    _filter: StringFilterInterface,
  ): void {
    const timeStamps: number[] = _filter.value.map(
      (elem: string) => (new Date(DateStringHelper.getDateStart(elem))).getTime(),
    );
    const condition: { } = {
      range: {
        [field]: {
          gte: (new Date(Math.max(...timeStamps))).toISOString(),
        },
      },
    };
    elasticFilters.must.push(condition);
  }
}
