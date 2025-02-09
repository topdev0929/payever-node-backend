import { Document } from 'mongoose';
import { PaymentCodeInterface } from '../interfaces';

export interface PaymentCodeModel extends PaymentCodeInterface, Document { }
