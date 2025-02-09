import { Document, Types } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { OrderInterface } from '../interfaces/order.interface';
import { ReservationModel } from './reservation.model';

export interface OrderModel extends OrderInterface, Document {
  business?: BusinessModel;
  reservations: Types.DocumentArray<ReservationModel>;
}
