import {
  FilterOptionInterface,
  FilterOptionTypeEnum,
  FiltersService,
} from '@pe/common-sdk';

export const FiltersConfig: FilterOptionInterface[] = [
  {
    fieldName: 'serviceEntityId',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'checkout.values.filter_labels.id',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'amount',
    filterConditions: FiltersService.getNumberFilterConditions(),
    label: 'checkout.values.filter_labels.amount',
    type: FilterOptionTypeEnum.number,
  },
  {
    fieldName: 'createdAt',
    filterConditions: FiltersService.getDateFilterConditions(),
    label: 'checkout.values.filter_labels.created_at',
    type: FilterOptionTypeEnum.date,
  },
  {
    fieldName: 'expiresAt',
    filterConditions: FiltersService.getDateFilterConditions(),
    label: 'checkout.values.filter_labels.expires_at',
    type: FilterOptionTypeEnum.date,
  },
  {
    fieldName: 'isActive',
    filterConditions: FiltersService.getDateFilterConditions(),
    label: 'checkout.values.filter_labels.is_active',
    type: FilterOptionTypeEnum.boolean,
  },
  {
    fieldName: 'creator',
    filterConditions: FiltersService.getDateFilterConditions(),
    label: 'checkout.values.filter_labels.creator',
    type: FilterOptionTypeEnum.string,
  },
];
