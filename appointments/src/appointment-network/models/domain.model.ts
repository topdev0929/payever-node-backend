import { Document } from 'mongoose';
import { DomainInterface } from '../interfaces';
import { AppointmentNetworkModel } from './appointment-network.model';

export interface DomainModel extends DomainInterface, Document {
  _id?: string;
  appointmentNetwork: AppointmentNetworkModel | string;
  
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
