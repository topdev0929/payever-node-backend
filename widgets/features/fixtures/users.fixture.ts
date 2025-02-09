import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { MongooseModel } from '../../src/common/enums';
import { UserModel } from '../../src/user';

class BusinessMediaListFixture extends BaseFixture {
  private readonly userModel: Model<UserModel>
    = this.application.get(getModelToken(MongooseModel.User));

  public async apply(): Promise<void> {

    await this.userModel.create({
      _id: '00000000-0000-0000-0000-000000000000',
      installations: [],
      tutorials: []
    });

    await this.userModel.create({
      _id: '11111111-1111-1111-1111-111111111111',
      installations: [],
      tutorials: []
    });
  }
}

export = BusinessMediaListFixture;
