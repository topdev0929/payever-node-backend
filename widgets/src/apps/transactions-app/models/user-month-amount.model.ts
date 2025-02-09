import { Document } from 'mongoose';
import { UserModel } from '../../../user/models';
import { UserDateRevenueInterface } from '../interfaces';

export interface UserMonthAmountModel extends UserDateRevenueInterface, Document {
  user: UserModel;
}
