import { UserInterface } from '../../../user/interfaces';
import { DateRevenueInterface } from './date-revenue.interface';

export interface UserDateRevenueInterface extends DateRevenueInterface {
  user: UserInterface;
}
