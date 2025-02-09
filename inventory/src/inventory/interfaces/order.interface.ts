import { BusinessInterface } from '@pe/business-kit';
import { ReservationInterface } from './reservation.interface';

export interface OrderInterface {
  flow: string;
  transaction: string;
  business?: BusinessInterface;
  businessId: string;
  reservations: ReservationInterface[];
  status: string;
}
