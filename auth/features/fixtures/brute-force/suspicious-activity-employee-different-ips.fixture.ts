import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

// tslint:disable-next-line:no-require-imports
import UsersFixture = require('./users.fixture');
import { LoginAttemptInterface } from '../../../src/brute-force/interfaces';
import { LoginAttemptSchemaName } from '../../../src/brute-force/schemas';
import { IpAddressEncoder } from '../../../src/users';

class SuspiciousActivityFixture extends BaseFixture {
  private readonly loginAttemptModel: Model<LoginAttemptInterface & Document> =
    this.application.get(getModelToken(LoginAttemptSchemaName));

  public async apply(): Promise<void> {
    const loginAttempts: LoginAttemptInterface[] = [];
    loginAttempts.push({
      ipAddress: IpAddressEncoder.encodeUsersIpAddress('127.0.0.1', UsersFixture.bannedEmployeeEmail),
      success: false,
      user: UsersFixture.bannedEmployee,
    });
    loginAttempts.push({
      ipAddress: IpAddressEncoder.encodeUsersIpAddress('127.0.0.2', UsersFixture.bannedEmployeeEmail),
      success: false,
      user: UsersFixture.bannedEmployee,
    });
    loginAttempts.push({
      ipAddress: IpAddressEncoder.encodeUsersIpAddress('127.0.0.3', UsersFixture.bannedEmployeeEmail),
      success: false,
      user: UsersFixture.bannedEmployee,
    });
    loginAttempts.push({
      ipAddress: IpAddressEncoder.encodeUsersIpAddress('127.0.0.4', UsersFixture.bannedEmployeeEmail),
      success: false,
      user: UsersFixture.bannedEmployee,
    });
    loginAttempts.push({
      ipAddress: IpAddressEncoder.encodeUsersIpAddress('127.0.0.5', UsersFixture.bannedEmployeeEmail),
      success: false,
      user: UsersFixture.bannedEmployee,
    });
    await this.loginAttemptModel.create(loginAttempts);
  }
}

export = SuspiciousActivityFixture;
