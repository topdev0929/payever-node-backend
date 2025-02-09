import { CreatedByEnum } from '../enums';
import { BusinessInterface } from './business.interface';

export interface DashboardInterface {
  business?: BusinessInterface;
  businessId: string;
  isDefault?: boolean;
  name?: string;
  createdBy?: CreatedByEnum;
}
