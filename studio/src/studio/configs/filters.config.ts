import {
  FilterOptionInterface,
  FilterOptionTypeEnum,
  TranslationPrefixEnum,
  FiltersService,
  ValuesService,
} from '@pe/common-sdk';
import { MediaTypeEnum } from '../enums';
  
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
    fieldName: 'example',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.example',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'mediaType',
    filterConditions: FiltersService.getOptionConditions(),
    label: 'translation.values.filter_lablels.media_type',
    options: ValuesService.getChoices(TranslationPrefixEnum.translationsMediaType, MediaTypeEnum),
    type: FilterOptionTypeEnum.option,
  },
  {
    fieldName: 'name',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.name',
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
