import { UserAccountInterface } from './user-account.interface';

export interface BusinessInterface {
  currency?: string;
  name: string;
  userAccount: UserAccountInterface;
  transactionsRetentionPeriod?: string;
  failedTransactionsRetentionPeriod?: string;
  isDeleted?: boolean;
}
