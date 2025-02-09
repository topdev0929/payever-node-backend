import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { User } from '../../src/users/interfaces';

class ResetTokenFixture extends BaseFixture {
  private readonly model: Model<User> = this.application.get('UserModel');

  public async apply(): Promise<void> {
    const tomorrow: Date = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await this.model.create({
      _id: 'c82581d9-4c1a-4d18-a209-01ed8e363b62',
      email: 'test@test.com',
      firstName: 'Test',
      isActive: false,
      isVerified: false,
      lastName: 'Test',
      resetPasswordExpires: tomorrow,
      resetPasswordToken: 'token',
      roles: [],
      secondFactorRequired: false,
      unverifiedPeriodExpires: tomorrow,
    } as User);
  }
}

export = ResetTokenFixture;
