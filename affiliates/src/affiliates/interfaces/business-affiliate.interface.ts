import { BusinessInterface } from '@pe/business-kit';
import { AffiliateInterface } from './affiliate.interface';

export interface BusinessAffiliateInterface {
  affiliate: AffiliateInterface;
  business?: BusinessInterface;
  businessId: string;
}
