import { Document } from 'mongoose';
import { BusinessModel } from '../../business';
import { IntegrationModel } from '../../integration';
import { ShippingTaskInterface } from '../interfaces/shipping-task.interface';

export interface ShippingTaskModel extends ShippingTaskInterface, Document {
  business?: BusinessModel;
  integration?: IntegrationModel;
}
