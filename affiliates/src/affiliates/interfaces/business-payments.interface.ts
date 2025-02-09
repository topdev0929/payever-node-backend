import { BusinessInterface } from '@pe/business-kit';
import { AffiliateBankInterface } from './affiliate-bank.interface';

export interface BusinessPaymentsInterface {
  payments: AffiliateBankInterface[] | string[];
  business: BusinessInterface | string;
}
