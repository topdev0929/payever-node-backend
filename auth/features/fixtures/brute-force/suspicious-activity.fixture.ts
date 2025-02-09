import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

// tslint:disable-next-line:no-require-imports
import UsersFixture = require('./users.fixture');
import { LoginAttemptInterface } from '../../../src/brute-force/interfaces';
import { BlockListInterface } from '../../../src/brute-force/interfaces/block-list.interface';
import { THREE_HOURS, TWENTY_MINUTES } from '../../../src/brute-force/constants/bruteforce';
import { LoginAttemptSchemaName } from '../../../src/brute-force/schemas';
import { BlockListSchemaName } from '../../../src/brute-force/schemas/block-list.schema';
import { IpAddressEncoder } from '../../../src/users';

class SuspiciousActivityFixture extends BaseFixture {
  private readonly model: Model<LoginAttemptInterface & Document> =
    this.application.get(getModelToken(LoginAttemptSchemaName));
  private readonly banModel: Model<BlockListInterface> = this.application.get(getModelToken(BlockListSchemaName));
  private readonly userId3: string = 'cc3bec59-6f88-4d48-91af-0f391bbb8ce2';

  public async apply(): Promise<void> {
    const loginAttempts: LoginAttemptInterface[] = [];
    let i: number;
    for (i = 0; i < 5; i++) {
      loginAttempts.push({
        ipAddress: IpAddressEncoder.encodeUsersIpAddress('127.0.0.1', 'banned-captcha@example.com'),
        success: false,
        user: UsersFixture.bannedCaptcha,
      });
    }
    loginAttempts.push({
      ipAddress: IpAddressEncoder.encodeUsersIpAddress('127.0.0.1', 'test@test.com'),
      success: false,
      user: 'c82581d9-4c1a-4d18-a209-01ed8e363b62',
    });

    await this.banModel.create({
      banCount: 2,
      blockedToDate: new Date(new Date().getTime() + TWENTY_MINUTES),
      user: UsersFixture.bannedFor20Minutes,
    } as BlockListInterface);
    await this.banModel.create({
      banCount: 3,
      blockedToDate: new Date(new Date().getTime() + THREE_HOURS),
      user: UsersFixture.bannedFor3Hours,
    } as BlockListInterface);
    await this.banModel.create({
      banCount: 3,
      blockedToDate: new Date(new Date().getTime() + THREE_HOURS),
      permanently: true,
      user: UsersFixture.permanentlyBanned,
    } as BlockListInterface);
    await this.banModel.create({
      banCount: 3,
      blockedToDate: new Date(new Date().getTime() + THREE_HOURS),
      permanently: true,
      user: 'c82581d9-4c1a-4d18-a209-01ed8e363b62',
    } as BlockListInterface);
    await this.model.create(loginAttempts);
    // ban models for admin api
    await this.banModel.create({
      banCount: 3,
      blockedToDate: new Date(),
      ipAddress: IpAddressEncoder.encodeUsersIpAddress('192.168.123.321', ''),
      permanently: true,
    } as BlockListInterface);
    await this.banModel.create({
      banCount: 3,
      blockedToDate: new Date(),
      ipAddress: IpAddressEncoder.encodeUsersIpAddress('192.168.1.123', ''),
      permanently: true,
    } as BlockListInterface);
    await this.banModel.create({
      banCount: 3,
      blockedToDate: new Date(),
      permanently: true,
      user: this.userId3,
    } as BlockListInterface);
  }
}

export = SuspiciousActivityFixture;
