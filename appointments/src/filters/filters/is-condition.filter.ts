import { FilterConditionEnum } from '@pe/common-sdk';
import { FilterQuery } from 'mongoose';

import { FilterInterface } from '../interfaces';

export class IsConditionFilter {
  public static getName(): string {
    return FilterConditionEnum.is;
  }

  public static apply(
    filters: Array<FilterQuery<any>>,
    field: string,
    _filter: FilterInterface,
  ): void {
    const filter: FilterQuery<any> = { };
    filter[field] = { $in: _filter.value };
    
    filters.push(filter);
  }
}
