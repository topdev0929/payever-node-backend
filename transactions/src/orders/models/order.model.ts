import { Document } from 'mongoose';
import { OrderInterface } from '../interfaces';

export interface OrderModel extends OrderInterface, Document {
}
