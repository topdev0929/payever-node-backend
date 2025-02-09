import { Model } from 'mongoose';

import { User } from '../interfaces';

export interface UserModel extends Model<User> {
  isPermanentlyBlocked: (user: User, ipAddress: string) => Promise<boolean>;
}
