import {
  FilterOptionInterface,
  FilterOptionTypeEnum,
  FiltersService,
} from '@pe/common-sdk';

export const FiltersConfig: FilterOptionInterface[] = [
  {
    containsTranslations: true,
    fieldName: 'titleTranslations',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'connect.values.filter_labels.name',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'category',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'connect.values.filter_labels.category',
    type: FilterOptionTypeEnum.string,
  },
  {
    containsTranslations: true,
    fieldName: 'developerTranslations',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'connect.values.filter_labels.developer',
    type: FilterOptionTypeEnum.string,
  },
];
