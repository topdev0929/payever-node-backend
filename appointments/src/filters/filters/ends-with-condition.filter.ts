import { FilterConditionEnum } from '@pe/common-sdk';
import { FilterQuery } from 'mongoose';

import { FilterInterface } from '../interfaces';

export class EndsWithConditionFilter {
  public static getName(): string {
    return FilterConditionEnum.endsWith;
  }

  public static apply(
    filters: Array<FilterQuery<any>>,
    field: string,
    _filter: FilterInterface,
  ): void {
    for (const value of _filter.value) {
      const filter: FilterQuery<any> = { };
      filter[field] = { $regex: `*${value}` };
      
      filters.push(filter);
    }
  }
}
