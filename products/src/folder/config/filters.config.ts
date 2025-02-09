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
    fieldName: 'album',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.album',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'barcode',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.barcode',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'company',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.company',
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
    fieldName: 'description',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.description',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'language',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.language',
    type: FilterOptionTypeEnum.string,
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
    fieldName: 'vatRate',
    filterConditions: FiltersService.getNumberFilterConditions(),
    label: 'translation.values.filter_lablels.vat_rate',
    type: FilterOptionTypeEnum.number,
  },
  {
    fieldName: 'updatedAt',
    filterConditions: FiltersService.getDateFilterConditions(),
    label: 'translation.values.filter_lablels.updated_at',
    type: FilterOptionTypeEnum.date,
  },
];
