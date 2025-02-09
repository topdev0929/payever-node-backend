import { BusinessInterface } from '@pe/business-kit/modules';

export interface ApplicationInterface {
  business: BusinessInterface;
  email: string;
  name: string;
  title: string;
  type?: string;
}
