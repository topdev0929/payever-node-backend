import { RuleActionEnum } from '../enums';

export interface RuleActionInterface {
  type: RuleActionEnum;
  value?: any;
  webhookUrl?: string;
}
