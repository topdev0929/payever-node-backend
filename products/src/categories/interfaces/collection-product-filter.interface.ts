import { FilterFieldConditionForProductBusiness } from '../../common/types';
import { FilterFieldTypeEnum } from '../../common/enums';

export interface CollectionProductFilterInterface {
  field: string;
  fieldType: FilterFieldTypeEnum;
  fieldCondition: FilterFieldConditionForProductBusiness;
  value?: string;
  filters?: CollectionProductFilterInterface[];
}
