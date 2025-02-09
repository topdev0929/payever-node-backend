import { Document } from 'mongoose';

export interface MobileAppInterface extends Document {
  appleStoreUrl: string;
  currentVersion: string;
  minVersion: string;
  playStoreUrl: string;
}
