import { Document } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { BusinessIntegrationSubInterface } from '../interfaces';
import { IntegrationModel } from './integration.model';

export interface BusinessIntegrationSubModel extends BusinessIntegrationSubInterface, Document {
  business?: BusinessModel;
  integration?: IntegrationModel;
}
