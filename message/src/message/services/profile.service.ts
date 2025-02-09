import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Query } from 'mongoose';
import { EventDispatcher } from '@pe/nest-kit';
import { ChatMemberStatusEnum } from '@pe/message-kit';

import { PrivacyDto } from '../../http/dto';

import { Profile, ProfileDocument } from '../schemas';
import { StatusEnum } from '../enums';
import { UserDocument } from 'src/projections/models';
import { InternalEventCodesEnum } from '../../common';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
      private readonly profileModel: Model<ProfileDocument>,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async findById(_id: string): Promise<ProfileDocument> {
    return this.profileModel.findById(_id);
  }

  public find(filter: FilterQuery<ProfileDocument>): Query<ProfileDocument[], ProfileDocument> {
    return this.profileModel.find(filter);
  }

  public async addSession(
    memberId: string,
    sessionId: string,
    userAgent: string,
    userIp: string,
  ): Promise<ProfileDocument> {
    return this.profileModel.findByIdAndUpdate(memberId, {
      $push: {
        sessions: {
          _id: sessionId,
          ipAddress: userIp,
          userAgent,
        },
      },
    });
  }

  public async updatePrivacy(
    id: string,
    dto: PrivacyDto,
  ): Promise<ProfileDocument> {
    return this.profileModel.findByIdAndUpdate(
      id,
      {
        $set: {
          privacy: dto,
        },
      },
      {
        new: true,
      },
    );
  }

  public checkPrivacy(user: UserDocument): UserDocument {
    if (user?.profile?.privacy?.profilePhoto?.showTo === StatusEnum.Nobody) {
      user.userAccount.logo = undefined;
    }

    return user;
  }

  public async isUsernameOccupied(username: string): Promise<boolean> {
    return Boolean(await this.profileModel.findOne({
      username: username,
    }).exec());
  }

  public async setUsername(userId: string, username: string): Promise<ProfileDocument> {
    return this.profileModel.findOneAndUpdate({
      _id: userId,
    }, {
      username,
    }, {
      new: true,
      upsert: true,
    });
  }

  public async setStatus(userId: string, newStatus: ChatMemberStatusEnum): Promise<ProfileDocument> {
    const updatedProfile: ProfileDocument = await this.profileModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          lastSeen: new Date(),
          status: newStatus,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    await this.eventDispatcher.dispatch(
      InternalEventCodesEnum.UserStatusChanged,
      updatedProfile,
    );

    return updatedProfile;
  }
}
