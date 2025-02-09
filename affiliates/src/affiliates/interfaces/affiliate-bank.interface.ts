import { BusinessInterface } from '@pe/business-kit';

export interface AffiliateBankInterface {
  accountHolder: string;
  accountNumber: string; 
  bankName: string; 
  city: string;  
  country: string;
  business: BusinessInterface | string;
}

