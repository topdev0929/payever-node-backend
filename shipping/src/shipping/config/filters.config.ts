import {
  FilterOptionInterface,
  FilterOptionTypeEnum,
  TranslationPrefixEnum,
  FiltersService,
  ValuesService,
} from '@pe/common-sdk';
import { 
  BoxTypesEnums, 
  CreatedByEnum, 
  DimensionUnitEnums, 
  WeightUnitEnums,
  BoxKindsEnums,
} from '../enums';
  
export const FiltersConfig: FilterOptionInterface[] = [
  {
    fieldName: '_id',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels._id',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'createdBy',
    filterConditions: FiltersService.getOptionConditions(),
    label: 'translation.values.filter_lablels.createdBy',
    options: ValuesService.getChoices(TranslationPrefixEnum.translationsCreatedBy, CreatedByEnum),
    type: FilterOptionTypeEnum.option,
  },
  {
    fieldName: 'dimensionUnit',
    filterConditions: FiltersService.getOptionConditions(),
    label: 'translation.values.filter_lablels.dimensionUnit',
    options: ValuesService.getChoices(TranslationPrefixEnum.shippingDimensionUnit, DimensionUnitEnums),
    type: FilterOptionTypeEnum.option,
  },
  {
    fieldName: 'height',
    filterConditions: FiltersService.getNumberFilterConditions(),
    label: 'translation.values.filter_lablels.height',
    type: FilterOptionTypeEnum.number,
  },
  {
    fieldName: 'integration',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.integration',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'kind',
    filterConditions: FiltersService.getOptionConditions(),
    label: 'translation.values.filter_lablels.kind',
    options: ValuesService.getChoices(TranslationPrefixEnum.shippingKind, BoxKindsEnums),
    type: FilterOptionTypeEnum.option,
  },
  {
    fieldName: 'length',
    filterConditions: FiltersService.getNumberFilterConditions(),
    label: 'translation.values.filter_lablels.length',
    type: FilterOptionTypeEnum.number,
  },
  {
    fieldName: 'name',
    filterConditions: FiltersService.getStringFilterConditions(),
    label: 'translation.values.filter_lablels.name',
    type: FilterOptionTypeEnum.string,
  },
  {
    fieldName: 'type',
    filterConditions: FiltersService.getOptionConditions(),
    label: 'translation.values.filter_lablels.type',
    options: ValuesService.getChoices(TranslationPrefixEnum.translationsType, BoxTypesEnums),
    type: FilterOptionTypeEnum.option,
  },
  {
    fieldName: 'updatedAt',
    filterConditions: FiltersService.getDateFilterConditions(),
    label: 'translation.values.filter_lablels.updatedAt',
    type: FilterOptionTypeEnum.date,
  },
  {
    fieldName: 'weight',
    filterConditions: FiltersService.getNumberFilterConditions(),
    label: 'translation.values.filter_lablels.weight',
    type: FilterOptionTypeEnum.number,
  },
  {
    fieldName: 'weightUnit',
    filterConditions: FiltersService.getOptionConditions(),
    label: 'translation.values.filter_lablels.weightUnit',
    options: ValuesService.getChoices(TranslationPrefixEnum.shippingWeightUnit, WeightUnitEnums),
    type: FilterOptionTypeEnum.option,
  },
  {
    fieldName: 'width',
    filterConditions: FiltersService.getNumberFilterConditions(),
    label: 'translation.values.filter_lablels.width',
    type: FilterOptionTypeEnum.number,
  },
];
