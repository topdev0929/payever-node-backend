import {
  FilterOptionInterface,
  FilterOptionTypeEnum,
  FiltersService,
  TranslationPrefixEnum,
  ValuesService,
} from '@pe/common-sdk';
import { PostSentStatusEnum, PoststatusEnum, PostTypeEnum } from '../enums';


export const FiltersConfig: FilterOptionInterface[] = [
  {
    fieldName: 'content',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.content',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'media',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.media',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'postedAt',
    filterConditions: FiltersService.getDateFilterConditions(),
    label: 'translation.values.filter_lablels.posted_at',
    type: FilterOptionTypeEnum.date,
  },
  {
    fieldName: 'sentStatus',
    filterConditions: FiltersService.getOptionConditions(),
    label: 'translation.values.filter_lablels.sent_status',
    options: ValuesService.getChoices(TranslationPrefixEnum.translationsSentStatus, PostSentStatusEnum),
    type: FilterOptionTypeEnum.option,
  },
  {
    fieldName: 'status',
    filterConditions: FiltersService.getOptionConditions(),
    label: 'translation.values.filter_lablels.status',
    options: ValuesService.getChoices(TranslationPrefixEnum.translationsStatus, PoststatusEnum),
    type: FilterOptionTypeEnum.option,
  },
  {
    fieldName: 'title',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.title',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'toBePostedAt',
    filterConditions: FiltersService.getDateFilterConditions(),
    label: 'translation.values.filter_lablels.toBePostedAt',
    type: FilterOptionTypeEnum.date,
  },
  {
    fieldName: 'type',
    filterConditions: FiltersService.getOptionConditions(),
    label: 'translation.values.filter_lablels.type',
    options: ValuesService.getChoices(TranslationPrefixEnum.translationsType, PostTypeEnum),
    type: FilterOptionTypeEnum.option,
  },
  {
    fieldName: 'updatedAt',
    filterConditions: FiltersService.getDateFilterConditions(),
    label: 'translation.values.filter_lablels.updatedAt',
    type: FilterOptionTypeEnum.date,
  },
];
