import { Document } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { IntegrationModel } from '../../integration/models';
import { ConnectionInterface } from '../interfaces';

export interface ConnectionModel extends ConnectionInterface, Document {
  business?: BusinessModel;
  integration: IntegrationModel;
}
