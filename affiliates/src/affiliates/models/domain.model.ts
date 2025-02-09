import { Document } from 'mongoose';
import { DomainInterface } from '../interfaces';
import { AffiliateBrandingModel } from './affiliate-branding.model';

export interface DomainModel extends DomainInterface, Document {
  _id?: string;

  affiliateBranding: AffiliateBrandingModel | string;
  
  
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
