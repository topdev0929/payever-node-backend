import { Document } from 'mongoose';
import { BusinessModel } from '../../../business/models';
import { BusinessDateRevenueInterface } from '../interfaces';

export interface BusinessMonthAmountModel extends BusinessDateRevenueInterface, Document {
  business?: BusinessModel;
}
