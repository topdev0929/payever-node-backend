import { ChannelSetModel } from '@pe/channels-sdk';
import { BusinessModel } from '@pe/business-kit';
import { AffiliateProgramInterface } from '../interfaces';
import { AffiliateCommissionModel } from './affiliate-commission.model';
import { AffiliateContactModel } from './affiliate-contact.model';
import { AffiliateBrandingModel } from './affiliate-branding.model';
import { Document } from 'mongoose';
import { ProductModel } from './product.model';

export interface AffiliateProgramModel extends AffiliateProgramInterface, Document {
  affiliateBranding?: AffiliateBrandingModel | string;
  affiliates?: AffiliateContactModel[] | string[];
  business: BusinessModel | string;
  channelSets?: ChannelSetModel[] | string[];
  commission: AffiliateCommissionModel[] | string[];
  products: ProductModel[] | string[];
}
