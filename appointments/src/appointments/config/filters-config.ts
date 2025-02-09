import {
  FilterOptionInterface,
  FilterOptionTypeEnum,
  FiltersService,
  ChoiceItemDto,
} from '@pe/common-sdk';

const YES_NO_OPTIONS: ChoiceItemDto[] = [
  {
    label: 'appointments.values.filter_options.yes',
    value: true,
  },
  {
    label: 'appointments.values.filter_options.no',
    value: false,
  },
];

export const FiltersConfig: FilterOptionInterface[] = [
  {
    fieldName: '_id',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'appointments.values.filter_labels._id',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'allDay',
    filterConditions: FiltersService.getOptionConditions(),
    label: 'appointments.values.filter_labels.all_day',
    options: YES_NO_OPTIONS,
    type: FilterOptionTypeEnum.option,
  },
  {
    fieldName: 'repeat',
    filterConditions: FiltersService.getOptionConditions(),
    label: 'appointments.values.filter_labels.repeat',
    options: YES_NO_OPTIONS,
    type: FilterOptionTypeEnum.option,
  },
  {
    fieldName: 'date',
    filterConditions: FiltersService.getDateFilterConditions(),
    label: 'appointments.values.filter_labels.date',
    type: FilterOptionTypeEnum.date,
  },
  {
    fieldName: 'time',
    filterConditions: FiltersService.getTimeFilterConditions(),
    label: 'appointments.values.filter_labels.time',
    type: FilterOptionTypeEnum.time,
  },
  {
    fieldName: 'location',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'appointments.values.filter_labels.location',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'note',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'appointments.values.filter_labels.note',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'createdAt',
    filterConditions: FiltersService.getDateFilterConditions(),
    label: 'appointments.values.filter_labels.created_at',
    type: FilterOptionTypeEnum.date,
  },
  {
    fieldName: 'updatedAt',
    filterConditions: FiltersService.getDateFilterConditions(),
    label: 'appointments.values.filter_labels.updated_at',
    type: FilterOptionTypeEnum.date,
  },
];
