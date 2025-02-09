import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { Group } from '../../src/employees/interfaces';

class GroupsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<Group> = this.application.get('GroupsModel');

    await model.create({
      _id: '8a13bd00-90f1-11e9-9f67-7200004fe4c4',
      businessId: '8a13bd00-90f1-11e9-9f67-7200004fe4c0',
      employees: [
        '8a13bd00-90f1-11e9-9f67-7200004fe4c2',
      ],
      name: 'test',
    } as any);
  }
}

export = GroupsFixture;
