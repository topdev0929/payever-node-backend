import { ChannelSetInterface } from '@pe/channels-sdk';
import { BusinessInterface } from '@pe/business-kit';
import { AffiliateStatusEnum, AppliesToEnum, CommissionTypeEnum } from '../enums';
import { AffiliateCommissionInterface } from './affiliate-commission.interface';
import { AffiliateContactInterface } from './affiliate-contact.interface';
import { ProductInterface } from './product.interface';
import { AffiliateBrandingInterface } from './affiliate-branding.interface';

export interface AffiliateProgramInterface {
  affiliateBranding?: AffiliateBrandingInterface | string;
  appliesTo: AppliesToEnum;
  affiliates?: AffiliateContactInterface[] | string[];
  assets: number;
  business: BusinessInterface | string;
  categories: string[];
  channelSets?: ChannelSetInterface[] | string[];
  clicks?: number;
  commission: AffiliateCommissionInterface[] | string[];
  commissionType: CommissionTypeEnum;
  cookie: number;
  currency: string;
  defaultCommission: number;
  inviteLink?: string;
  name: string;
  products: ProductInterface[] | string[];
  programApi: string;
  status: AffiliateStatusEnum;
  startedAt: Date;
  url: string;
}
