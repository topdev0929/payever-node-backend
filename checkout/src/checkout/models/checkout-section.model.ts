import { Document } from 'mongoose';
import { CheckoutSectionInterface } from '../interfaces';

export interface CheckoutSectionModel extends CheckoutSectionInterface, Document {
}
