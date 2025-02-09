import { BusinessInterface } from '@pe/business-kit';

export interface AppointmentNetworkInterface {
  favicon: string;
  logo: string;
  name: string;
  business: BusinessInterface | string;
  isDefault: boolean;
}
