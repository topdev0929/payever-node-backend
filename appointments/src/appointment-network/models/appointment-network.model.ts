import { Document } from 'mongoose';
import { BusinessModel } from '@pe/business-kit';
import { AppointmentNetworkInterface } from '../interfaces';

export interface AppointmentNetworkModel extends AppointmentNetworkInterface, Document {
  business: BusinessModel | string;
}
