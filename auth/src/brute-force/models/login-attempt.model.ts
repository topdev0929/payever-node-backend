import { Document, Model } from 'mongoose';
import { LoginAttemptInterface } from '../interfaces';

export interface LoginAttemptModel extends Model<LoginAttemptInterface & Document> {
  clearLoginFailures(userId: string, ipAddress: string): Promise<void>;
  logAttempt(userId: string, ipAddress: string, success: boolean): Promise<LoginAttemptInterface>;
}
