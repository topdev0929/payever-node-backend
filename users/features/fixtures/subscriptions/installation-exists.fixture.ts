import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessAppInstallationModel } from '../../../src/user/models';

class InstallationExistsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<BusinessAppInstallationModel> = this.application.get('BusinessAppInstallationModel');

    await model.create({
      _id: '11111111-1111-1111-1111-111111111111',
      businessId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      code: 'shop',
    });
  }
}

export = InstallationExistsFixture;
