import { Document } from 'mongoose';

export interface LocationInterface extends Document {
  userId: string;
  userAgent: string;
  subnet: string;
  hashedSubnet: string;
  createdAt?: Date;
  name: string;
  verified: boolean;
}
