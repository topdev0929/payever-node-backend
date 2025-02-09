import { FilterConditionEnum } from '@pe/common-sdk';
import { FilterQuery } from 'mongoose';

import { FilterInterface } from '../interfaces';

export class LessThenConditionFilter {
  public static getName(): string {
    return FilterConditionEnum.lessThan;
  }

  public static apply(
    filters: Array<FilterQuery<any>>,
    field: string,
    _filter: FilterInterface,
  ): void {
    for (const value of _filter.value) {
      const filter: FilterQuery<any> = { };
      filter[field] = { $lt: value };
      
      filters.push(filter);
    }
  }
}
