import { CommissionTypesEnum } from '../../enums';
import { RuleRangeInterface } from './rule-range.interface';

export interface IntegrationRuleInterface {
  isActive?: boolean;
  freeOver?: number;
  flatRate?: number;
  commission?: number;
  weightRanges?: RuleRangeInterface[];
  rateRanges?: RuleRangeInterface[];
  commissionType?: CommissionTypesEnum;
}
