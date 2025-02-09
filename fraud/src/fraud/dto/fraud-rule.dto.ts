import { FraudRuleInterface, RuleActionInterface, RuleConditionInterface } from '../interfaces';

export class FraudRuleDto implements FraudRuleInterface {
  public _id?: string;
  public actions: RuleActionInterface[];
  public businessId: string;
  public conditions: RuleConditionInterface[];
  public description: string;
  public name: string;
}
