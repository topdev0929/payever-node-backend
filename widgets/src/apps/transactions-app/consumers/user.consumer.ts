import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPerBusinessDayAmountModel, UserPerBusinessMonthAmountModel } from '../models';
import { MongooseModel, UserRabbitMessagesEnum } from '../enums';
import { MessageBusChannelsEnum } from '../../../common';

@Controller()
export class UserConsumer {
  constructor(
    @InjectModel(MongooseModel.UserPerBusinessDayAmount)
    private readonly dayAmountModel: Model<UserPerBusinessDayAmountModel>,
    @InjectModel(MongooseModel.UserPerBusinessMonthAmount)
    private readonly monthAmountModel: Model<UserPerBusinessMonthAmountModel>, ) { }

  @MessagePattern({ 
    channel: MessageBusChannelsEnum.widgets,
    name: UserRabbitMessagesEnum.MergeDuplicateUsers, 
  })
  public async mergeDuplicateUsers(payload: { targetUser: any; usersToMerge: any[] }): Promise<void> {
    const targetUser: any = payload.targetUser;
    const usersToMerge: any[] = payload.usersToMerge;
    
    await this.mergeDayAmountUser(usersToMerge, targetUser);
    await this.mergeMonthAmountUser(usersToMerge, targetUser);
  }

  public async mergeDayAmountUser(usersToMerge: any[], targetUser: any): Promise<void> {
    const userIds: string[] = usersToMerge.map((user) => user._id);
    await this.dayAmountModel.updateMany(
      {userId: { $in: userIds}},
      {
        $set: {
          userId: targetUser._id,
        },
      }
    );
  }

  public async mergeMonthAmountUser(usersToMerge: any[], targetUser: any): Promise<void> {
    const userIds: string[] = usersToMerge.map((user) => user._id);
    await this.monthAmountModel.updateMany(
      {userId: { $in: userIds}},
      {
        $set: {
          userId: targetUser._id,
        },
      }
    );
  }
}

