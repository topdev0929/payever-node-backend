import { PaymentMailInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface PaymentMailModel extends PaymentMailInterface, Document { }
