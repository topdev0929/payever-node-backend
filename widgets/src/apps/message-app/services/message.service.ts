import { Injectable } from '@nestjs/common';
import { EventDispatcher } from '@pe/nest-kit';
import { environment } from '../../../environments';
import { InjectModel } from '@nestjs/mongoose';
import { ChatModel } from '../models';
import { Model } from 'mongoose';
import { ChatEventDto, ChatMemberUpdateDto } from '../dto';
import { ChatSchemaName } from '../schemas';
import { MessagingTypeEnum, WidgetDataUpdatedEventsEnum } from '../enums';
import { BaseQueryDto } from '../../../common/dtos';

@Injectable()
export class MessageService {
  private baseUrl: string;
  constructor(
    private readonly eventDispatcher: EventDispatcher,
    @InjectModel(ChatSchemaName) private readonly chatModel: Model<ChatModel>,
  ) {
    this.baseUrl = environment.messageServiceUrl;
  }

  public async createOrUpdateChatFromEvent(data: ChatEventDto): Promise<ChatModel> {
    const businessId: string = data.businessId;

    const chat: ChatModel = await this.chatModel.findOneAndUpdate(
      { _id: data.id },
      {
        $set: {
          businessId,
          lastSeen: data.lastSeen,
          members: data.members,
          name: data.name,
          photo: data.photo,
          type: data.type,
        },
      },
      { new: true, upsert: true },
    );

    await this.eventDispatcher.dispatch(
      WidgetDataUpdatedEventsEnum.MessageDataUpdated,
      await this.getBusinessChat(data.businessId),
    );

    return chat;
  }

  public async deleteChat(data: ChatEventDto): Promise<void> {
    await this.chatModel.deleteOne({ _id: data.id }).exec();
  }

  public async getBusinessChat(
    businessId: string,
    userId: string = null,
    dto: BaseQueryDto = null,
  ): Promise<ChatModel[]> {
    const chatFilter: any = userId ?
      {
        $or: [
          { type: MessagingTypeEnum.SupportChannel },
          { type: MessagingTypeEnum.Group, members: { $elemMatch: { user: userId } } },
          { type: MessagingTypeEnum.Channel, members: { $elemMatch: { user: userId } } },
        ],
      } :
      {
        $or: [
          { type: MessagingTypeEnum.SupportChannel },
          { type: MessagingTypeEnum.Group },
          { type: MessagingTypeEnum.Channel },
        ],
      };

    const query: any = {
      ...dto?.query,
      ...chatFilter,
      businessId,
    };

    const limit: number = dto?.limit || 100;
    const page: number = dto?.page || 1;
    const sort: any = dto?.sort || { createdAt: -1 };
    const skip: number = (page - 1) * limit;

    return this.chatModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
  }

  public async getPersonalChat(userId: string): Promise<ChatModel[]> {
    return this.chatModel.find(
      { 
        $or: [ 
          { type: MessagingTypeEnum.Group }, 
          { type: MessagingTypeEnum.Channel }, 
          { type: MessagingTypeEnum.SupportChannel },
        ],
        'members.user': userId,
      },
    );
  }

  public async excludeMember(dto: ChatMemberUpdateDto): Promise<void> {
    await this.chatModel.updateOne(
      { _id: dto.chatId },
      { $pull: { members: { user: dto.member.user } } },
    ).exec();
  }

  public async includeMember(dto: ChatMemberUpdateDto): Promise<void> {
    await this.chatModel.findByIdAndUpdate(
      dto.chatId,
      {
        $addToSet: {
          members: dto.member,
        },
      }).exec();
  }
}
