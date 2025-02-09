import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { FiltersList } from '../filters.list';

@Injectable()
export class FilterService {

  public static addFilters(mongoFilters: Array<FilterQuery<any>>, inputFilters: any): void {
    for (const key of Object.keys(inputFilters)) {
      this.addFilter(mongoFilters, key, inputFilters[key]);
    }
  }

  private static addFilter(mongoFilters: Array<FilterQuery<any>>, field: string, filter: any): void {
    if (filter && !filter.length) {
      filter = [filter];
    }

    const _mongoFilter: Array<FilterQuery<any>> = [];

    for (const _filter of filter) {

      if (!_filter.value) {
        return;
      }
      if (!Array.isArray(_filter.value)) {
        _filter.value = [_filter.value];
      }

      for (const mongoFilter of FiltersList) {
        if (_filter.condition === mongoFilter.getName()) {
          mongoFilter.apply(_mongoFilter, field, _filter);
          break;
        }
      }
    }

    if (_mongoFilter.length) {
      mongoFilters.push({ $and: _mongoFilter });
    }
  }
}
