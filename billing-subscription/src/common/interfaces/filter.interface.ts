import { FilterFieldCondition, FilterFieldTypeEnum } from '../../common/enums';

export interface FilterInterface {
  field: string;
  fieldType: FilterFieldTypeEnum;
  fieldCondition: FilterFieldCondition;
  value?: any;
  filters?: FilterInterface[];
  valueIn?: string[];
}
