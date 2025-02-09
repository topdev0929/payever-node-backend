import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { BaseFixture } from '@pe/cucumber-sdk';
import { OrganizationBusinessModel, OrganizationBusinessSchemaName } from '../../src/psp';
import { ORGANIZATION_ID } from './const';

class OrganizationBusinessFixture extends BaseFixture {
  protected readonly organizationBusinessModel: Model<OrganizationBusinessModel> =
    this.application.get(getModelToken(OrganizationBusinessSchemaName));

  public async apply(): Promise<void> {
    await this.organizationBusinessModel.create({
      businessId: 'f9d1c255-05a5-4ad2-98ac-a904da157d91',
      organizationId: ORGANIZATION_ID,
    });
  }
}

export = OrganizationBusinessFixture;
