import {
  FilterOptionInterface,
  FilterOptionTypeEnum,
  FiltersService,
} from '@pe/common-sdk';


export const FiltersConfig: FilterOptionInterface[] = [
  {
    fieldName: '_id',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels._id',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'channelSet',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.channelSet',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'country',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.country',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'currency',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.currency',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'imports',
    filterConditions: FiltersService.getNumberFilterConditions(),
    label: 'translation.values.filter_lablels.imports',
    type: FilterOptionTypeEnum.number,
  },
  {
    fieldName: 'price',
    filterConditions: FiltersService.getNumberFilterConditions(),
    label: 'translation.values.filter_lablels.price',
    type: FilterOptionTypeEnum.number,
  },
  {
    fieldName: 'title',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.title',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'type',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.type',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'updatedAt',
    filterConditions: FiltersService.getDateFilterConditions(),
    label: 'translation.values.filter_lablels.updatedAt',
    type: FilterOptionTypeEnum.date,
  },
];
