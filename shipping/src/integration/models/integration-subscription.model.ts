import { Document, Types } from 'mongoose';
import { IntegrationSubscriptionInterface } from '../interfaces';
import { IntegrationRuleModel } from './rules';
import { IntegrationModel } from './integration.model';

export interface IntegrationSubscriptionModel extends IntegrationSubscriptionInterface, Document {
    id: string;
    integration: IntegrationModel;
    rules?: Types.DocumentArray<IntegrationRuleModel>;
}
