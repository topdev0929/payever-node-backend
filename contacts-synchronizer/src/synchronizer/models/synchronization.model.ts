import { Document } from 'mongoose';
import { BusinessModel } from '@pe/business-kit';
import { IntegrationModel } from '@pe/synchronizer-kit';
import { SynchronizationInterface } from '../interfaces';

export interface SynchronizationModel extends SynchronizationInterface, Document {
  readonly business?: BusinessModel;
  readonly integration?: IntegrationModel;
}
