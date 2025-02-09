import { RuleActionInterface } from './rule-action.interface';
import { RuleConditionInterface } from './rule-condition.interface';

export interface FraudRuleInterface {
  _id?: any;
  businessId?: string;
  name: string;
  description?: string;
  conditions: RuleConditionInterface[];
  actions: RuleActionInterface[];
}
