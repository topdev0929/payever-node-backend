import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMember, ChatMemberEmbeddedDocument } from '../submodules/platform';
import { RabbitChannelsEnum, UserRabbitMessagesEnum } from '../enums';


@Controller()
export class UserConsumer {
  constructor(
    @InjectModel(ChatMember.name) private readonly chatMemberModel: Model<ChatMemberEmbeddedDocument>,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: UserRabbitMessagesEnum.MergeDuplicateUsers,
  })
  public async mergeDuplicateUsers(payload: { targetUser: any; usersToMerge: any[] }): Promise<void> {
    const usersToMerge: any[] = payload.usersToMerge;
    const targetUser: any = payload.targetUser;

    const userIds: string[] = usersToMerge.map((user: any) => user._id);

    await this.chatMemberModel.updateMany(
      { user: { $in: userIds } },
      {
        $set: {
          user: targetUser._id,
          userAccount: {
            _id: targetUser.userAccount._id,
            email: targetUser.userAccount.email,
            firstName: targetUser.userAccount.firstName,
            lastName: targetUser.userAccount.lastName,
            logo: targetUser.userAccount.logo,
            phone: targetUser.userAccount.phone,
          },
        },
      },
    );
  }
}

