import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { SecondFactorTokenInterface } from '../../src/2fa/interfaces';

class SecondFactorCodesFixture extends BaseFixture {
  private readonly model: Model<SecondFactorTokenInterface> = this.application.get('SecondFactorTokenModel');

  public async apply(): Promise<void> {
    await this.model.create({
      active: true,
      code: 123456,
      userId: 'ac031fc5-43d8-4e17-a07b-daa1c3b8ea81',
    });
    await this.model.create({
      active: true,
      code: 123456,
      userId: '15edf7ca-cc8e-406c-9cd5-964b19eafb11',
    });
  }
}

export = SecondFactorCodesFixture;
