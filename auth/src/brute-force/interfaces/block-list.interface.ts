import { Document } from 'mongoose';
import { User } from '../../users/interfaces';

export interface BlockListInterface extends Document {
  user?: User | string;
  ipAddress: string;
  blockedToDate: Date;
  banCount: number;
  permanently?: boolean;
}
