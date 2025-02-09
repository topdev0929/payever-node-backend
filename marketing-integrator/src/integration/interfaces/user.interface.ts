import { UserAccountInterface } from './user-account.interface';
import { BusinessInterface } from './business.interface';

export interface UserInterface {
  readonly userAccount: UserAccountInterface;
  readonly createdAt?: string;
  businesses: BusinessInterface[];
}
