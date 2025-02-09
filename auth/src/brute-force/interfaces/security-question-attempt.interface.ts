import { User } from '../../users/interfaces';

export interface SecurityQuestionAttemptInterface {
  user: User | string;
  success: boolean;
  ipAddress: string;
}
