import { FilterFieldCondition, FilterFieldTypeEnum } from '../enums';

export interface FilterInterface {
  field: string;
  fieldType: FilterFieldTypeEnum;
  fieldCondition: FilterFieldCondition;
  value?: any;
  filters?: FilterInterface[];
  valueIn?: string[];
}
