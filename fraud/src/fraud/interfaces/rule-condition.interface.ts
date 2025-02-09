import { RuleTypeEnum, RuleOperatorEnum } from '../enums';
import { RuleTimeUnitEnum } from '../enums/rule-time-unit.enum';

export interface RuleConditionInterface {
  type: RuleTypeEnum;
  operator?: RuleOperatorEnum;
  value?: any;
  field?: string;
  compareTo?: string;
  timeUnit?: RuleTimeUnitEnum;
  customField?: string;
  listId?: string;
  expiryDate?: Date;
  threshold?: string;
  geoLocation?: string;
}
