import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BlockedUserDocument } from '../model';
import { BlockedUserSchemaName } from '../schemas';

@Injectable()
export class BlockedUsersService {
  constructor(
    @InjectModel(BlockedUserSchemaName)
      private readonly blockedUserModel: Model<BlockedUserDocument>,
  ) { }

  public async getBlockedUsers(userId: string): Promise<BlockedUserDocument[]> {
    return this.blockedUserModel.find({
      user: userId,
    });
  }

  public async getBlockedUser(userId: string, blockedUserId: string): Promise<BlockedUserDocument> {
    return this.blockedUserModel.findOne({
      blockedUser: blockedUserId,
      user: userId,
    });
  }

  public async blockUser(currentUserId: string, userId: string): Promise<BlockedUserDocument> {
    let blockedUser: BlockedUserDocument = await this.blockedUserModel.findOne({
      blockedUser: userId,
      user: currentUserId,
    }).exec();

    if (!blockedUser) {
      blockedUser = await this.blockedUserModel.create({
        blockedUser: userId,
        user: currentUserId,
      });
    }

    return blockedUser;
  }

  public async unblockUser(currentUserId: string, userId: string): Promise<void> {
    await this.blockedUserModel.findOneAndRemove({
      blockedUser: userId,
      user: currentUserId,
    }).exec();
  }
}
