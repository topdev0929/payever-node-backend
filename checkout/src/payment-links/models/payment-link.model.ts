import { Document } from 'mongoose';
import { PaymentLinkInterface } from '../interfaces';

export interface PaymentLinkModel extends PaymentLinkInterface, Document { }
