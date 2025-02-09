import { CheckoutInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface CheckoutModel extends  CheckoutInterface, Document { }
