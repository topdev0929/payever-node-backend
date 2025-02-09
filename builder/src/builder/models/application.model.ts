import { Document } from 'mongoose';
import { ApplicationInterface } from '../interfaces';
import { BusinessModel } from '@pe/business-kit';

export interface ApplicationModel extends ApplicationInterface, Document {
  business: BusinessModel;
}
