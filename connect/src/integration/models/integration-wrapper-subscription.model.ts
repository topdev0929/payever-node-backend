import { Document } from 'mongoose';
import { BusinessModelLocal } from '../../business';
import { IntegrationWrapperSubscriptionInterface } from '../interfaces';

export interface IntegrationWrapperSubscriptionModel extends IntegrationWrapperSubscriptionInterface, Document {
  business?: BusinessModelLocal;
}
