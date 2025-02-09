import { Injectable } from '@nestjs/common';
import { ProductFilterFieldEnum, ProductFilterFieldsTranslation } from '../enums';

@Injectable()
export class FilterService {
  private readonly totalCount: number;
  private readonly selectFilter: string[] = ['Type'];
  private readonly sortFilter: string[] = ['Price'];
  constructor() {
    this.totalCount = this.count(ProductFilterFieldEnum);
  }

  /* tslint:disable:cognitive-complexity */
  public async getFilter(
    filter: string,
  ): Promise<any> {
    const filterData: any = filter !== '' ? JSON.parse(filter) : [];
    let filterFields: string[];
    if (filterData.length > 0) {
      filterFields = this.getFilterFields(filterData);
    }

    const filters: any[] = [];
    for (const k in ProductFilterFieldEnum) {
      if (ProductFilterFieldEnum.hasOwnProperty(k)) {
        if (filterFields && !filterFields.includes(ProductFilterFieldEnum[k])) {
          continue;
        }
        if (!this.selectFilter.includes(k) && !this.sortFilter.includes(k)) {
          continue;
        }
        const subFilter: any =
          {
            'field': ProductFilterFieldEnum[k],
            'options': [],
            'title': ProductFilterFieldsTranslation[k],
            'type': 'text',
          };
        switch (true) {
          case k === 'Type':
            subFilter.type = 'select';
            subFilter.options = [
              {
                'label': 'renderer.grid-filter.physical',
                'value': 'physical',
              },
              {
                'label': 'renderer.grid-filter.digital',
                'value': 'digital',
              },
              {
                'label': 'renderer.grid-filter.service',
                'value': 'service',
              },
            ];
            break;
          case this.sortFilter.includes(k):
            subFilter.type = 'sort-select';
            subFilter.options = [
              {
                field: ProductFilterFieldEnum[k],
                label: `${ProductFilterFieldsTranslation[k]}_asc`,
                value: 'asc',
              },
              {
                field: ProductFilterFieldEnum[k],
                label: `${ProductFilterFieldsTranslation[k]}_desc`,
                value: 'desc',
              },
            ];
            break;
        }

        filters.push(subFilter);
      }
    }

    return {
      result: filters,
      totalCount: this.selectFilter.length + this.sortFilter.length,
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
