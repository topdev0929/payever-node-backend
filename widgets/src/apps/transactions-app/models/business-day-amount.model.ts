import { Document } from 'mongoose';
import { BusinessModel } from '../../../business/models';
import { BusinessDateRevenueInterface } from '../interfaces';

export interface BusinessDayAmountModel extends BusinessDateRevenueInterface, Document {
  business?: BusinessModel;
}
