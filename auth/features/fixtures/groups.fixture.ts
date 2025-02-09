import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { Group } from '../../src/employees/interfaces';
import { GroupsSchemaName } from '../../src/employees/schemas';

class GroupsFixture extends BaseFixture {
  private readonly model: Model<Group> = this.application.get(getModelToken(GroupsSchemaName));

  public async apply(): Promise<void> {
    await this.model.create({
      _id: 'bf088c5a-55d9-4945-a1b7-3d5893c54210',
      acls: [
        {
          create: true,
          delete: true,
          microservice: 'pos',
          read: true,
          update: true,
        },
      ],
      businessId: '74b58859-3a62-4b63-83d6-cc492b2c8e29',
      employees: ['09d1fdca-f692-4609-bc2d-b3003a24c30a'],
      name: 'Cashier',
    });
  }
}

export = GroupsFixture;
