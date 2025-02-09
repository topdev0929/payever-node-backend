import { User } from '../../users/interfaces';

export interface RegisterAttemptInterface {
  user: User | string;
  success: boolean;
  ipAddress: string;
}
