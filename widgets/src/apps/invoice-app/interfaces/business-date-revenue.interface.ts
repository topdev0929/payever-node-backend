import { BusinessInterface } from '../../../business/interfaces';
import { DateRevenueInterface } from './date-revenue.interface';

export interface BusinessDateRevenueInterface extends DateRevenueInterface {
  business?: BusinessInterface;
  businessId: string;
}
