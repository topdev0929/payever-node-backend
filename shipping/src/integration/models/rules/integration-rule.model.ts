import { Document, Types } from 'mongoose';
import { IntegrationRuleInterface } from '../../interfaces';
import { RuleRangeModel } from './rule-range.model';

export interface IntegrationRuleModel extends IntegrationRuleInterface, Document {
    weightRanges?: Types.DocumentArray<RuleRangeModel>;
    rateRanges?: Types.DocumentArray<RuleRangeModel>;
}
