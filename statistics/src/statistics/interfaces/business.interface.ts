import { BusinessDetailInterface } from './business-detail.interface';

export interface BusinessInterface {
  businessDetail?: BusinessDetailInterface;
  installedApps?: any;
  themeSettings?: any;
  currency?: string;
  owner?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}
