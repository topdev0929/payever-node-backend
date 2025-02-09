import { FilterConditionEnum } from '@pe/common-sdk';
import { FilterQuery } from 'mongoose';

import { FilterInterface } from '../interfaces';

export class GreaterThenConditionFilter {
  public static getName(): string {
    return FilterConditionEnum.greaterThan;
  }

  public static apply(
    filters: Array<FilterQuery<any>>,
    field: string,
    _filter: FilterInterface,
  ): void {
    for (const value of _filter.value) {
      const filter: FilterQuery<any> = { };
      filter[field] = { $gt: value };
      
      filters.push(filter);
    }
  }
}
