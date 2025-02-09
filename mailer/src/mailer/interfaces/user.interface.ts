import { Document } from 'mongoose';

import { UserAccountInterface } from './user-account.interface';

export interface UserInterface extends Document {
  _id: string;
  userAccount: UserAccountInterface;
  getFullName: () => string;
}
