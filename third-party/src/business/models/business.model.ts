import { IntegrationSubscriptionModel } from '@pe/third-party-sdk';
import { Document, Types } from 'mongoose';
import { BusinessInterface } from '../interfaces';

export interface BusinessModel extends BusinessInterface, Document {
  readonly subscriptions: Types.DocumentArray<IntegrationSubscriptionModel>;
}
