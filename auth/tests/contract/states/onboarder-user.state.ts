import { getModelToken } from '@nestjs/mongoose';

import { AbstractStateFixture } from '@pe/pact-kit';

import { UserSchemaName } from '../../../src/users';
import { UserModel } from '../../../src/users/models';
export class OnboarderUserStateFixture extends AbstractStateFixture {
  private readonly userModel: UserModel = this.application.get(getModelToken(UserSchemaName));
  public getStateName(): string {
    return 'Onboarder user with id 2673fa45-82b9-484c-bcbe-46da250c2639 exists';
  }
  public async apply(): Promise<void> {
    await this.userModel.create({
      _id: '2673fa45-82b9-484c-bcbe-46da250c2639',
      email: 'testcases@payever.de',
    });
  }
}
