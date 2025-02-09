import { Document } from 'mongoose';
import { ApplicationInterface } from './application.interface';

export interface ApplicationModel extends ApplicationInterface, Document {
  _id: any;
}
