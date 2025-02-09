import { AppointmentInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface AppointmentModel extends  AppointmentInterface, Document { }
