import { Schema } from 'mongoose';
import { BlockListInterface } from '../interfaces/block-list.interface';
import { TWENTY_FOUR_HOURS } from '../constants/bruteforce';

export const BlockListSchemaName: string = 'BlockList';

export const BlockListSchema: Schema = new Schema(
  {
    banCount: { type: Number, required: true },
    blockedToDate: { type: Date },
    ipAddress: { type: String },
    permanently: { type: Boolean },
    user: { type: String, ref: 'User' },
  },
  {
    autoIndex: true,
    collection: 'block-list',
    timestamps: { createdAt: true, updatedAt: false },
  },
)
  .index({ userId: 1 })
  .index({ userId: 1, ipAddress: 1 });

BlockListSchema.statics.isPermanentlyBlocked = async function (userId: string, ipAddress: string): Promise<boolean> {
  return (
    (await this.countDocuments({
      $or: [{ ipAddress }, { user: userId }],
      permanently: true,
    })) > 0
  );
};

BlockListSchema.statics.isIpBlocked = async function (ipAddress: string): Promise<boolean> {
  return (
    (await this.countDocuments({
      ipAddress,
      permanently: true,
    })) > 0
  );
};

BlockListSchema.statics.getActiveBanCount =
  async function (userId: string, ipAddress: string): Promise<number> {
    const filters: any = [];

    if (ipAddress) {
      filters.push({ ipAddress });
    }

    if (userId) {
      filters.push({ user: userId });
    }

    const record: BlockListInterface = await this.findOne(
      {
        $or: filters,
        blockedToDate: { $gte: new Date() },
      },
      null,
      { sort: { banCount: -1 } },
    );

    return record ? record.banCount : 0;
  };

BlockListSchema.statics.getMaxBlockIn24Hrs =
  async function (userId: string, ipAddress: string): Promise<number> {
    const maxBlock: BlockListInterface = await this.findOne(
      {
        $or: [{ ipAddress }, { user: userId }],
        createdAt: { $gte: new Date().getTime() - TWENTY_FOUR_HOURS },
      },
      null,
      { sort: { banCount: -1 } },
    );

    return maxBlock ? maxBlock.banCount : 0;
  };
