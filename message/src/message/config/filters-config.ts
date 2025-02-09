import {
  FilterOptionInterface,
  FilterOptionTypeEnum,
  FiltersService,
  TranslationPrefixEnum,
  ValuesService,
} from '@pe/common-sdk';
import {
  ChannelTypeEnum,
} from '../enums';
import { MessagingIntegrationsEnum, MessagingTypeEnum } from '@pe/message-kit';

export const FiltersConfig: FilterOptionInterface[] = [
  {
    fieldName: 'contact',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.contact',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'integrationName',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.integration_name',
    options: ValuesService.getChoices(TranslationPrefixEnum.messageIntegrationName, MessagingIntegrationsEnum),
    type: FilterOptionTypeEnum.option,
  },
  {
    fieldName: 'subType',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.sub_type',
    options: ValuesService.getChoices(TranslationPrefixEnum.messageSubType, ChannelTypeEnum),
    type: FilterOptionTypeEnum.option,
  },
  {
    fieldName: 'type',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.type',
    options: ValuesService.getChoices(TranslationPrefixEnum.translationsType, MessagingTypeEnum),
    type: FilterOptionTypeEnum.option,
  },
];
