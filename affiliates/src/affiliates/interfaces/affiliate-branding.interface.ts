import { BusinessInterface } from '@pe/business-kit';

export interface AffiliateBrandingInterface {
  favicon: string;
  logo: string;
  name: string;
  business: BusinessInterface | string;
  isDefault: boolean;
}
