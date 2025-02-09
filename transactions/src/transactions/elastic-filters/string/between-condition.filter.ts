import { FilterConditionEnum } from '@pe/common-sdk';
import { BetweenFilterInterface } from '../interfaces';

export class BetweenConditionFilter {
  public static getName(): string {
    return FilterConditionEnum.between;
  }

  public static apply(
    elasticFilters: any,
    field: string,
    _filter: BetweenFilterInterface,
  ): void {
    const from: number[] = _filter.value.map((elem: { from: string }) => parseInt(elem.from, 10));
    const to: number[] = _filter.value.map((elem: { to: string }) => parseInt(elem.to, 10));

    const condition: { } = {
      range: {
        [field]: {
          gte: Math.max(...from),
          lte: Math.min(...to),
        },
      },
    };
    elasticFilters.must.push(condition);
  }
}
