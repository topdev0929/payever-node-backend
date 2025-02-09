import { Document } from 'mongoose';

export interface UserPerBusinessMonthAmountModel extends Document<string> {
  _id: string;

  amount: number;
  date: string;

  businessId: string;
  userId: string;
}
