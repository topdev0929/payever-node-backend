import { Document } from 'mongoose';

export interface UserPerBusinessDayAmountModel extends Document<string> {
  _id: string;

  amount: number;
  date: string;

  businessId: string;
  userId: string;
}
