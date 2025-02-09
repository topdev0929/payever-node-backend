import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { TrustedDomainModel } from '../../src/user';

const BUSINESS_ID = '88038e2a-90f9-11e9-a492-7200004fe4c0';

class TrustedDomainFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const trustedDomainModel: Model<TrustedDomainModel> = await this.application.get('TrustedDomainModel');

    await trustedDomainModel.create({
      domain: "domain123.com123",
      businessId: BUSINESS_ID,
    });
  }
}

export = TrustedDomainFixture;
