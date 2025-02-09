import { BusinessModel } from '@pe/business-kit';
import { BusinessPaymentsInterface } from '../interfaces';
import { Document } from 'mongoose';
import { AffiliateBankModel } from './affiliate-bank.model';

export interface BusinessPaymentsModel extends BusinessPaymentsInterface, Document {
  payments: AffiliateBankModel[] | string[];
  business: BusinessModel | string;
}
