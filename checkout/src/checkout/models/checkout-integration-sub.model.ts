import { Document } from 'mongoose';
import { IntegrationModel } from '../../integration';
import { CheckoutIntegrationSubInterface } from '../interfaces';
import { CheckoutModel } from './checkout.model';

export interface CheckoutIntegrationSubModel extends CheckoutIntegrationSubInterface, Document {
  checkout?: CheckoutModel;
  integration?: IntegrationModel;
}
