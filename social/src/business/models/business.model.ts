import { BusinessModel } from '@pe/business-kit';
import { Document, Types } from 'mongoose';
import { IntegrationSubscriptionModel } from '../../integration/models';
import { BusinessInterface } from '../interfaces';

export interface BusinessLocalModel extends BusinessModel, BusinessInterface, Document {
  _id?: string;
  createdAt?: string;
  integrationSubscriptions: Types.DocumentArray<IntegrationSubscriptionModel>;
}
