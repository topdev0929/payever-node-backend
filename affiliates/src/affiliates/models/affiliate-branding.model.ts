import { AffiliateBrandingInterface } from '../interfaces';
import { Document } from 'mongoose';
import { BusinessModel } from '@pe/business-kit';

export interface AffiliateBrandingModel extends AffiliateBrandingInterface, Document {
  business: BusinessModel | string;
}
