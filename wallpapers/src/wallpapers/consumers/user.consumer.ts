import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RabbitChannelsEnum, RabbitMessages } from '../enum';
import { UserWallpapersModel } from '../models';
import { UserWallpapersSchemaName } from '../schemas';

@Controller()
export class UserConsumer {
  constructor(
    @InjectModel(UserWallpapersSchemaName) private readonly userWallpapersModel: Model<UserWallpapersModel>,
  ) { }

  @MessagePattern({ 
    channel: RabbitChannelsEnum.Wallpapers,
    name: RabbitMessages.MergeDuplicateUsers,
  })
  public async mergeDuplicateUsers(payload: { targetUser: any; usersToMerge: any[] } ): Promise<void> {
    const usersToMerge: any[] = payload.usersToMerge;
    const targetUser: any = payload.targetUser;

    const userIds: string[] = usersToMerge.map((user) => user._id);

    await this.userWallpapersModel.updateMany(
      { user: { $in: userIds} },
      {
        $set: {
          user: targetUser._id,
        },
      }
    );
  }
}

