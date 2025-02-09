import { AffiliateBankInterface } from '../interfaces';
import { Document } from 'mongoose';
import { BusinessModel } from '@pe/business-kit';

export interface AffiliateBankModel extends AffiliateBankInterface, Document {
  business: BusinessModel | string;
}
