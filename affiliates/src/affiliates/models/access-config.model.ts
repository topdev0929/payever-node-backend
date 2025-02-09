import { Document } from 'mongoose';

import { BusinessModel } from '@pe/business-kit';
import { AffiliateBrandingModel } from './affiliate-branding.model';
import { AccessConfigInterface } from '../interfaces';

export interface AccessConfigModel extends AccessConfigInterface, Document {
  _id?: string;
  business: BusinessModel | string; 
  affiliateBranding: AffiliateBrandingModel | string;   
}
