import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model, Document } from 'mongoose';
import { IpAddressEncoder } from '../../../src/users/tools';
import { LoginAttemptInterface } from '../../../src/brute-force/interfaces';
import { getModelToken } from '@nestjs/mongoose';
import { LoginAttemptSchemaName } from '../../../src/brute-force/schemas';
import { BlockListInterface } from '../../../src/brute-force/interfaces/block-list.interface';
import { BlockListSchemaName } from '../../../src/brute-force/schemas/block-list.schema';
import { TWENTY_FOUR_HOURS } from '../../../src/brute-force/constants/bruteforce';

class UsersFixture extends BaseFixture {
  private readonly model: Model<LoginAttemptInterface & Document> =
    this.application.get(getModelToken(LoginAttemptSchemaName));
  private readonly banModel: Model<BlockListInterface> = this.application.get(getModelToken(BlockListSchemaName));

  public async apply(): Promise<void> {
    const loginAttempts: LoginAttemptInterface[] = [];
    let i: number;
    for (i = 0; i < 5; i++) {
      loginAttempts.push({
        ipAddress: IpAddressEncoder.encodeUsersIpAddress('127.0.0.1', null),
        success: false,
        user: null,
      });
    }
    await this.banModel.create({
      banCount: 4,
      blockedToDate: new Date(new Date().getTime() - TWENTY_FOUR_HOURS),
      createdAt: new Date(new Date().getTime() - TWENTY_FOUR_HOURS - TWENTY_FOUR_HOURS),
      user: null,
    } as any);

    await this.banModel.create({
      banCount: 2,
      blockedToDate: new Date(new Date().getTime() + TWENTY_FOUR_HOURS),
      createdAt: new Date(new Date().getTime()),
      user: null,
    } as any);

    await this.model.create(loginAttempts);
  }
}

export = UsersFixture;
