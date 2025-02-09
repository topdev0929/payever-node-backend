import { Document } from 'mongoose';
import { RuleRangeInterface } from '../../interfaces';

export interface RuleRangeModel extends RuleRangeInterface, Document {
    id: string;
}
