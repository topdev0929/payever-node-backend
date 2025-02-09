import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { User } from '../../src/models/interfaces/user';
import { userModel, UserModel } from '../../src/models/user.model';
export = UserFixture;

class UserFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<UserModel> = this.application.get<Model<UserModel>>(getModelToken(userModel.modelName));

    await model.create({
      _id: '1d2a38e4-3955-4e29-9099-e74c72a98336',
      installedApps: [
        {
          app: '37370e19-1ab0-4a22-83ed-2f2a090f485d',
          code: 'transactions',
          installed: false,
        },
        {
          app: '44f60143-2aee-40fb-87ad-074dd133e048',
          code: 'business-app2',
          installed: false,
        },
      ],
    } as User);
  }
}
