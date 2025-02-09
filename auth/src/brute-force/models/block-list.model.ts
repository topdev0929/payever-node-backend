import { Model } from 'mongoose';
import { BlockListInterface } from '../interfaces/block-list.interface';

export interface BlockListModel extends Model<BlockListInterface> {
  isPermanentlyBlocked: (userId: string, ipAddress: string) => Promise<boolean>;
  isIpBlocked: (ipAddress: string) => Promise<boolean>;
  getActiveBanCount: (userId: string, ipAddress: string) => Promise<number>;
  getMaxBlockIn24Hrs: (userId: string, ipAddress: string) => Promise<number>;
}
