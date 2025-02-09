import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { BusinessInterface, Template, UserInterface } from '../../src/mailer/interfaces';
import { BusinessSchemaName, UserSchemaName } from '../../src/mailer/schemas';

class UsersFixture extends BaseFixture {
  private readonly model: Model<UserInterface> = this.application.get(getModelToken(UserSchemaName));

  public async apply(): Promise<void> {
    await this.model.create({
      _id: '2b8d46a1-f296-4ad9-8bcf-ed7348ed216a',
      userAccount: {
        email: 'test@test.com',
        firstName: 'test',
        lastName: 'test',
      },
    });

    await this.model.create({
      _id: '1b8d46a1-f296-4ad9-8bcf-ed7348ed216a',
      userAccount: {
        email: 'test1@test.com',
        firstName: 'test',
        lastName: 'test',
      },
    });
  }
}

export = UsersFixture;
