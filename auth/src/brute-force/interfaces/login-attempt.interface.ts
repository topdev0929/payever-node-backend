import { User } from '../../users/interfaces';

export interface LoginAttemptInterface {
  user: User | string;
  success: boolean;
  ipAddress: string;
}
