import { Injectable } from '@nestjs/common';
import { CategoryFilterFieldEnum } from '../enums';

@Injectable()
export class FilterService {
  private readonly totalCount: number;
  private readonly selectFilter: string[] = [];
  constructor() {
    this.totalCount = this.count(CategoryFilterFieldEnum);
  }

  public async getFilter(
    filter: string,
  ): Promise<any> {
    const filterData: any = filter !== '' ? JSON.parse(filter) : [];
    let filterFields: string[];
    if (filterData.length > 0) {
      filterFields = this.getFilterFields(filterData);
    }

    const filters: any[] = [];
    for (const k in CategoryFilterFieldEnum) {
      if (CategoryFilterFieldEnum.hasOwnProperty(k)) {
        if (filterFields && !filterFields.includes(CategoryFilterFieldEnum[k])) {
          continue;
        }
        const subFilter: any =
          {
            'field': CategoryFilterFieldEnum[k],
            'options': [],
            'title': k,
            'type': 'text',
          };
        filters.push(subFilter);
      }
    }

    return {
      result: filters,
      totalCount: this.totalCount,
    };
  }

  private count(object: any): number {
    let size: number = 0;
    let key: any;
    for (key in object) {
      if (object.hasOwnProperty(key)) {
        size++;
      }
    }

    return size;
  }

  private getFilterFields(filters: any): string[] {
    let filterField: string[] = [];
    for (const filter of filters) {
      if (filter.field) {
        filterField.push(filter.field);
      } else if (typeof(filter.value) === 'object') {
        filterField = filterField.concat(this.getFilterFields(filter.value));
      }
    }

    return filterField;
  }
}
