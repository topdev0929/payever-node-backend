import { Document } from 'mongoose';
import { CheckoutMetricsInterface } from '../interfaces';

export interface CheckoutMetricsModel extends CheckoutMetricsInterface, Document {
}
