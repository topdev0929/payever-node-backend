import { Document } from 'mongoose';
import { BusinessModelLocal } from '../../business';
import { IntegrationSubscriptionInterface } from '../interfaces';
import { IntegrationModel } from './integration.model';

export interface IntegrationSubscriptionModel extends IntegrationSubscriptionInterface, Document {
  integration?: IntegrationModel;
  business?: BusinessModelLocal;
}
