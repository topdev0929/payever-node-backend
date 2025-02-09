import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { TrustedDomainModel } from '../../src/users/models';
import { BUSINESS_1_ID } from './const';

class ResetTokenFixture extends BaseFixture {
  private readonly model: Model<TrustedDomainModel> = this.application.get('TrustedDomainModel');

  public async apply(): Promise<void> {

    await this.model.create({
      businessId: BUSINESS_1_ID,
      domain: 'domain.com',
    });

    await this.model.create({
      businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
      domain: 'example.com',
    });
 
  }
}

export = ResetTokenFixture;
