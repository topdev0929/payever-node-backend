import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { BaseFixture } from '@pe/cucumber-sdk';
import { OrganizationModel, OrganizationSchemaName } from '../../src/psp';
import { ORGANIZATION_ID } from './const';

class OrganizationFixture extends BaseFixture {
  protected readonly organizationModel: Model<OrganizationModel> =
    this.application.get(getModelToken(OrganizationSchemaName));

  public async apply(): Promise<void> {
    await this.organizationModel.create({
      _id: ORGANIZATION_ID,
      clientId: 'client-id',
      clientSecret: 'client-secret',
      name: 'Adyen',
    });
  }
}

export = OrganizationFixture;
