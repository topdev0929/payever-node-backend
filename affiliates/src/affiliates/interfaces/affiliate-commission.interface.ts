import { CommissionTypeEnum } from '../enums';

export interface AffiliateCommissionInterface {
  commission: string; 
  commissionType: CommissionTypeEnum;
  identifier: string;
  title: string;
}
