import {
  FilterOptionInterface,
  FilterOptionTypeEnum,
  FiltersService,
  ValuesService,
  TranslationPrefixEnum,
} from '@pe/common-sdk';

import { CreatedByEnum } from '../enums';

export const FiltersConfig: FilterOptionInterface[] = [
  {
    fieldName: 'createdBy',
    filterConditions: FiltersService.getOptionConditions(),
    label: 'translation.values.filter_lablels.created_by',
    options: ValuesService.getChoices(TranslationPrefixEnum.translationsCreatedBy, CreatedByEnum),
    type: FilterOptionTypeEnum.option,
  },
  {
    fieldName: 'name',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.name',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'updatedAt',
    filterConditions: FiltersService.getDateFilterConditions(),
    label: 'translation.values.filter_lablels.updated_at',
    type: FilterOptionTypeEnum.date,
  },
];
