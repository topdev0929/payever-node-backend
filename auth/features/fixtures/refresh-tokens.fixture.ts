import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model, Types } from 'mongoose';

// tslint:disable-next-line:no-require-imports
import UsersFixture = require('./users.fixture');
import { TokenType } from '../../src/auth/enum';
import { RefreshTokenInterface } from '../../src/auth/interfaces';

class RefreshTokensFixture extends BaseFixture {
  private readonly model: Model<RefreshTokenInterface> = this.application.get('RefreshTokenModel');

  public async apply(): Promise<void> {
    await this.model.create({
      _id: Types.ObjectId('5d358470e89f6c1eecb82208'),
      ip: '127.0.0.1',
      revoked: false,
      tokenType: TokenType.auth,
      user: UsersFixture.secondFactorUserUuid,
      userAgent: 'node-superagent/3.8.3',
    });
    await this.model.create({
      _id: Types.ObjectId('5d026c4790d65476795f4fc1'),
      ip: '127.0.0.1',
      revoked: false,
      tokenType: TokenType.auth,
      user: UsersFixture.merchantUuid,
      userAgent: 'node-superagent/3.8.3',
    });
    await this.model.create({
      _id: Types.ObjectId('5cf01a4350e9bd3678f0325d'),
      ip: '127.0.0.1',
      revoked: false,
      tokenType: TokenType.auth,
      user: UsersFixture.adminUuid,
      userAgent: 'node-superagent/3.8.3',
    });
  }
}

export = RefreshTokensFixture;
