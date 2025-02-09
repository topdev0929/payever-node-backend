import { BusinessModel } from '@pe/business-kit';
import { BusinessAffiliateInterface } from '../interfaces';
import { Document } from 'mongoose';
import { AffiliateModel } from './affiliate.model';

export interface BusinessAffiliateModel extends BusinessAffiliateInterface, Document {
  affiliate: AffiliateModel;
  business?: BusinessModel;
}
