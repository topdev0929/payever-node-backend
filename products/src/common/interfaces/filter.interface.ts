import { FilterFieldTypeEnum } from '../../common/enums';
import { FilterFieldConditionForProductBusiness } from '../types';

export interface FilterInterface {
  field: string;
  fieldType: FilterFieldTypeEnum;
  fieldCondition: FilterFieldConditionForProductBusiness;
  value?: any;
  filters?: FilterInterface[];
  valueIn?: string[];
}
