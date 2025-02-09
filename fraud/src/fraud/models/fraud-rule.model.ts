import { Document } from 'mongoose';
import { FraudRuleInterface } from '../interfaces';

export interface FraudRuleModel extends FraudRuleInterface, Document { }
