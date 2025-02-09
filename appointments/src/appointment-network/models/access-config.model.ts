import { Document } from 'mongoose';
import { BusinessModel } from '../models/business.model';
import { AccessConfigInterface } from '../interfaces';
import { AppointmentNetworkModel } from './appointment-network.model';

export interface AccessConfigModel extends AccessConfigInterface, Document {
  _id?: string;
  business?: BusinessModel | string;
  appointmentNetwork: AppointmentNetworkModel | string;
}
