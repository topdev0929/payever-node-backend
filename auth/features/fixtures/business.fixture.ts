import { Model } from 'mongoose';

import { getModelToken } from '@nestjs/mongoose';

import { BaseFixture } from '@pe/cucumber-sdk';
import { BusinessSchemaName } from '@pe/business-kit';

import { BUSINESS_1_ID, BUSINESS_1_OWNER_ID } from './const';
import type { BusinessLocalDocument } from '../../src/business/schemas';
import { UserSchemaName, UserDocument } from '../../src/users';

class BusinessFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessLocalDocument> =
    this.application.get(getModelToken(BusinessSchemaName));
  private readonly userModel: Model<UserDocument> =
    this.application.get(getModelToken(UserSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_1_ID,
      name: 'BUSINESS_1',
      owner: BUSINESS_1_OWNER_ID,
    });

    await this.businessModel.create({
      _id: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
      name: 'BUSINESS_2',
      owner: 'b5965f9d-5971-4b02-90eb-537a0a6e07c7',
    });

    await this.businessModel.create({
      _id: '74b58859-3a62-4b63-83d6-cc492b2c8e28',
      name: 'BUSINESS_2',
      owner: 'b5965f9d-5971-4b02-90eb-537a0a6e07c7',
    });

    await this.businessModel.create({
      _id: '74b58859-3a62-4b63-83d6-cc492b2c8e31',
      name: 'BUSINESS_3',
      owner: 'b5965f9d-5971-4b02-90eb-537a0a6e07c7',
    });

    await this.businessModel.create({
      _id: '74b58859-3a62-4b63-83d6-cc492b2c8e32',
      name: 'BUSINESS_3',
      owner: '8b5fb669-8fa0-8c83-a8dd-8fa8d45d2098',
    });

    await this.userModel.create({
      _id: BUSINESS_1_OWNER_ID,
      email: 'business-1-owner@example.com',
    });
  }
}

export = BusinessFixture;
