import { 
  NestedFieldConditionEnum, 
  NumberFieldConditionEnum, 
  ObjectFieldConditionEnum, 
  RangeFieldConditionEnum, 
  StringFieldConditionEnum,
} from '../enums';

export declare type FilterFieldConditionForProductBusiness = 
  RangeFieldConditionEnum | 
  StringFieldConditionEnum | 
  NumberFieldConditionEnum | 
  NestedFieldConditionEnum | 
  ObjectFieldConditionEnum;
