import { FilterConditionEnum } from '@pe/common-sdk';
import { FilterQuery } from 'mongoose';

import { FilterInterface } from '../interfaces';

export class IsNotConditionFilter {
  public static getName(): string {
    return FilterConditionEnum.isNot;
  }

  public static apply(
    filters: Array<FilterQuery<any>>,
    field: string,
    _filter: FilterInterface,
  ): void {
    const filter: FilterQuery<any> = { };
    filter[field] = { $not: { $in: _filter.value } };
    
    filters.push(filter);
  }
}
