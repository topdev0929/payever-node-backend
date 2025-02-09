import { BusinessInterface } from '@pe/business-kit';
import { AffiliateInterface } from './affiliate.interface';

export interface AccessConfigInterface {
  isLive: boolean;
  internalDomain: string;
  internalDomainPattern: string;
  isPrivate: boolean;
  ownDomain: string;
  privateMessage: string;
  privatePassword: string;
  socialImage: string;
  isLocked: boolean;
  version?: string;
  business: BusinessInterface | string;
  affiliate: AffiliateInterface | string;
}
