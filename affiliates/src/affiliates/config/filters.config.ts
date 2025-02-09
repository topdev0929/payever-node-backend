import {
  FilterOptionInterface,
  FilterOptionTypeEnum,
  TranslationPrefixEnum,
  FiltersService,
  ValuesService,
} from '@pe/common-sdk';
import { CommissionTypeEnum } from '../enums';

  
export const FiltersConfig: FilterOptionInterface[] = [
  {
    fieldName: '_id',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels._id',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'assets',
    filterConditions: FiltersService.getNumberFilterConditions(),
    label: 'translation.values.filter_lablels.assets',
    type: FilterOptionTypeEnum.number,
  },
  {
    fieldName: 'clicks',
    filterConditions: FiltersService.getNumberFilterConditions(),
    label: 'translation.values.filter_lablels.clicks',
    type: FilterOptionTypeEnum.number,
  },
  {
    fieldName: 'commissionType',
    filterConditions: FiltersService.getOptionConditions(),
    label: 'translation.values.filter_lablels.commission_type',
    options: ValuesService.getChoices(TranslationPrefixEnum.affiliatesCommissionType, CommissionTypeEnum),
    type: FilterOptionTypeEnum.option,
  },
  {
    fieldName: 'cookie',
    filterConditions: FiltersService.getDateFilterConditions(),
    label: 'translation.values.filter_lablels.cookie',
    type: FilterOptionTypeEnum.date,
  },
  {
    fieldName: 'currency',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.currency',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'name',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.name',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'programApi',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.program_api',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'startedAt',
    filterConditions: FiltersService.getDateFilterConditions(),
    label: 'translation.values.filter_lablels.started_at',
    type: FilterOptionTypeEnum.date,
  },
  {
    fieldName: 'status',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.status',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'url',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.url',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'updatedAt',
    filterConditions: FiltersService.getDateFilterConditions(),
    label: 'translation.values.filter_lablels.updated_at',
    type: FilterOptionTypeEnum.date,
  },
];
