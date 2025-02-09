import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatMemberStatusEnum } from '@pe/message-kit';

import { ProfileDocument, Profile } from '../../src/message';
import { UserDocument } from '../../src/projections/models';
import { StatusEnum } from '../../src/message/enums';
import {
  ID_OF_USER_1,
  ID_OF_EXISTING_BUSINESS,
  ID_OF_USER_2,
  ID_OF_USER_3,
  ID_OF_USER_4,
  USERNAME_OF_USER_1,
  ID_OF_USER_6,
  ID_OF_BUSINESS_2,
  ID_OF_BUSINESS_3,
  ID_OF_USER_7,
  ID_OF_USER_5,
  USER_5_EMAIL, SOME_OWNER_ID, SOME_EMPLOYEE_ID, SOME_RANDOM_USER_ID, OWNERS_BUSINESS_ID, ID_OF_USER_10, ID_OF_USER_9, ID_OF_USER_8,
} from './const';
import { ChatMember, ChatMemberEmbeddedDocument } from '../../src/message/submodules/platform';

class UserFixture extends BaseFixture {
  protected readonly userModel: Model<UserDocument> =
    this.application.get(`UserModel`);
  protected readonly chatMember: Model<any> =
    this.application.get(`ChatMemberModel`);
  protected readonly profileModel: Model<ProfileDocument> =
    this.application.get(getModelToken(Profile.name));
  public async apply(): Promise<void> {
  
    await this.chatMember.create({
      _id: ID_OF_USER_10,
      id: ID_OF_USER_10,
      user: ID_OF_USER_10,
      addedBy: ID_OF_USER_3,
      addMethod: 'owner',
      userAccount: {
        _id: ID_OF_USER_4,
        email: 'uem1@example.com',
        firstName: 'Jake',
        lastName: 'Johns',
        logo: 'jake.png',
        phone: '+84518478',
      },
    });

    await this.chatMember.create({
      _id: ID_OF_USER_8,
      user: ID_OF_USER_8,
      addedBy: ID_OF_USER_3,
      addMethod: 'owner',
      userAccount: {
        _id: ID_OF_USER_4,
        email: 'UEM1@example.com',
        firstName: 'Jake',
        lastName: 'Johns',
        logo: 'jake.png',
        phone: '+84518478',
      },
    });

    await this.chatMember.create({
      _id: ID_OF_USER_9,
      user: ID_OF_USER_9,
      addedBy: ID_OF_USER_3,
      addMethod: 'owner',
      userAccount: {
        _id: ID_OF_USER_4,
        email: 'uem1@EXAmple.com',
        firstName: 'Jake',
        lastName: 'Johns1',
        logo: 'jake.png',
        phone: '+84518478',
      },
    });

    await this.userModel.create({
      _id: ID_OF_USER_1,
      businesses: [ID_OF_EXISTING_BUSINESS],
      userAccount: {
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        logo: 'john.png',
        phone: '+394233123',
      },
    });
    await this.profileModel.create({
      _id: ID_OF_USER_1,
      username: USERNAME_OF_USER_1,
      lastSeen: null,
      sessions: [],
      status: ChatMemberStatusEnum.Offline,
    });
    await this.userModel.create({
      _id: ID_OF_USER_2,
      businesses: [ID_OF_EXISTING_BUSINESS],
      userAccount: {
        email: 'sam@example.com',
        firstName: 'Sam',
        lastName: 'Smith',
        logo: 'sam.png',
        phone: '+15551234567',
      },
    });
    await this.userModel.create({
      _id: ID_OF_USER_3,
      businesses: [ID_OF_EXISTING_BUSINESS],
      userAccount: {
        email: 'jake@example.com',
        firstName: 'Jake',
        lastName: 'Johns',
        logo: 'jake.png',
        phone: '+84518478',
      },
    });
    await this.profileModel.create({
      _id: ID_OF_USER_3,
      privacy: {
        channelsAndGroups: {
          canAdd: StatusEnum.Nobody,
        },
        forwardedMessage: {
          showTo: StatusEnum.Nobody,
        },
        profilePhoto: {
          showTo: StatusEnum.Nobody,
        },
        status: {
          showTo: StatusEnum.Nobody,
        },
      },
      lastSeen: null,
      sessions: [],
      status: ChatMemberStatusEnum.Offline,
    });
    await this.userModel.create({
      _id: ID_OF_USER_4,
      businesses: [ID_OF_EXISTING_BUSINESS],
      userAccount: {
        email: 'reza@example.com',
        firstName: 'Reza',
        lastName: 'Gh',
        logo: 'reza.png',
        phone: '+984342',
      },
    });

    await this.profileModel.create({
      _id: ID_OF_USER_4,
      privacy: {
        channelsAndGroups: {
          canAdd: StatusEnum.Everybody,
        },
        forwardedMessage: {
          showTo: StatusEnum.Everybody,
        },
        profilePhoto: {
          showTo: StatusEnum.Everybody,
        },
        status: {
          showTo: StatusEnum.Everybody,
        },
      },
      lastSeen: null,
      sessions: [],
      status: ChatMemberStatusEnum.Offline,
    });

    await this.userModel.create({
      _id: ID_OF_USER_5,
      businesses: [ID_OF_EXISTING_BUSINESS],
      userAccount: {
        email: USER_5_EMAIL,
        firstName: 'User5',
        lastName: 'Gh',
        logo: 'user.png',
        phone: '+984342344',
      },
    });

    await this.userModel.create({
      _id: ID_OF_USER_6,
      businesses: [
        ID_OF_EXISTING_BUSINESS,
      ],
      userAccount: {
        email: 'john.smith@example.com',
        firstName: 'John',
        lastName: 'Smith',
      }
    });


    await this.userModel.create({
      _id: ID_OF_USER_7,
      businesses: [
        ID_OF_EXISTING_BUSINESS,
        ID_OF_BUSINESS_2,
        ID_OF_BUSINESS_3,
      ],
      userAccount: {
        email: 'user-7@example.com',
        firstName: 'User-7',
        lastName: 'Doe',
        logo: 'john.png',
        phone: '+394233123',
      },
    });

    await this.profileModel.create({
      _id: ID_OF_USER_7,
      username: 'user-7',
      lastSeen: null,
      sessions: [],
      status: ChatMemberStatusEnum.Offline,
    });

    await this.userModel.create({
      _id: SOME_EMPLOYEE_ID,
      businesses: [
        OWNERS_BUSINESS_ID,
      ],
      userAccount: {
        email: 'employee@payever.de',
        firstName: 'John',
        lastName: 'Doe',
      }
    });

    await this.userModel.create({
      _id: SOME_OWNER_ID,
      businesses: [
        OWNERS_BUSINESS_ID,
      ],
      userAccount: {
        email: 'owner@payever.de',
        firstName: 'Beth',
        lastName: 'Smith',
      }
    });

    await this.userModel.create({
      _id: SOME_RANDOM_USER_ID,
      businesses: [
        ID_OF_BUSINESS_2,
      ],
      userAccount: {
        email: 'random@payever.de',
        firstName: 'Ron',
        lastName: 'Dom',
      }
    });
  }
}

export = UserFixture;
