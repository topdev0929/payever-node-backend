import { Document, Model } from 'mongoose';
import { RegisterAttemptInterface } from '../interfaces';

export interface RegisterAttemptModel extends Model<RegisterAttemptInterface & Document> {
  clearRegisterAttemptsByIpAddress(ipAddress: string): Promise<void>;
  clearRegisterAttemptsByUserId(userId: string): Promise<void>;
  logAttempt(userId: string, ipAddress: string): Promise<RegisterAttemptInterface>;
}
