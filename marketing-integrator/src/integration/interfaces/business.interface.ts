import { CompanyAddressInterface, CompanyDetailsInterface, ContactDetailsInterface } from '@pe/business-kit';
export interface BusinessInterface {
  _id: string;
  owner: string;
  name: string;
  logo?: string;
  wallpaper?: string;
  currency?: string;
  active: boolean;
  hidden: boolean;
  companyAddress: CompanyAddressInterface;
  companyDetails?: CompanyDetailsInterface;
  contactDetails?: ContactDetailsInterface;
  contactEmails?: string[];
  createdAt?: string;
} 
