import { Document } from 'mongoose';
import { ConnectionInterface } from '../interfaces';
import { BusinessModel } from '../../business/interfaces';
import { IntegrationModel } from './integration.model';

export interface ConnectionModel extends ConnectionInterface, Document {
  _id: string;
  business?: BusinessModel;
  integration: IntegrationModel;
}
