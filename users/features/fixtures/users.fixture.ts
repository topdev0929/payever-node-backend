import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { UserModel } from '../../src/user';

class UsersFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<UserModel> = this.application.get('UserModel');

    await model.create({
      _id: '8a13bd00-90f1-11e9-9f67-7200004fe4c0',
      userAccount: {
        language: 'en',
        salutation: 'test',
        firstName: 'test',
        lastName: 'test',
        phone: 'test',
        email: 'email@test.com',
        birthday: '2019-06-17T11:23:59.000Z',
        createdAt: '2019-06-17T11:23:59.000Z',
        logo: 'test',
        hasUnfinishedBusinessRegistration: true,
      },
      createdAt: '2019-06-17T11:23:59.000Z',
      businesses: ['88038e2a-90f9-11e9-a492-7200004fe4c0'],
    } as any);

    await model.create({
      _id: '85547e38-dfe5-4282-b1ae-c5542267f39e',
      userAccount: {
        language: 'en',
        salutation: 'test',
        firstName: 'test',
        lastName: 'test',
        phone: 'test',
        email: 'email@test.com',
        birthday: '2019-06-17T11:23:59.000Z',
        createdAt: '2019-06-17T11:23:59.000Z',
        logo: 'test',
      },
      createdAt: '2019-06-17T11:23:59.000Z',
      businesses: ['6502b371-4cda-4f1d-af9c-f9c5c886c455', 'fa8b1d32-8d5c-4839-9ea6-4af777098465'],
    } as any);

    await model.create({
      _id: '8a13bd00-90f1-12e9-9f67-7200004fe4c1',
      userAccount: {
        language: 'en',
        salutation: 'test',
        firstName: 'test',
        lastName: 'test',
        phone: 'test',
        email: 'employeeuser1@test.com',
        birthday: '2019-06-17T11:23:59.000Z',
        createdAt: '2019-06-17T11:23:59.000Z',
        logo: 'test',
        hasUnfinishedBusinessRegistration: true,
      },
      createdAt: '2019-06-17T11:23:59.000Z',
      businesses: ['88038e2a-90f9-11e9-a492-7200004fe4c0'],
    } as any);

    await model.create({
      _id: '8a13bd00-90f1-12e9-9f67-7200004fe4c2',
      userAccount: {
        language: 'en',
        salutation: 'test',
        firstName: 'test',
        lastName: 'test',
        phone: 'test',
        email: 'employeeuser2@test.com',
        birthday: '2019-06-17T11:23:59.000Z',
        createdAt: '2019-06-17T11:23:59.000Z',
        logo: 'test',
        hasUnfinishedBusinessRegistration: true,
      },
      createdAt: '2019-06-17T11:23:59.000Z',
      businesses: ['88038e2a-90f9-11e9-a492-7200004fe4c0'],
    } as any);

    await model.create({
      _id: '8a13bd00-90f1-12e9-9f67-6200004fe4c2',
      userAccount: {
        language: 'en',
        salutation: 'test',
        firstName: 'test',
        lastName: 'test',
        phone: 'test',
        email: 'onlyuser@test.com',
        birthday: '2019-06-17T11:23:59.000Z',
        createdAt: '2019-06-17T11:23:59.000Z',
        logo: 'test',
        hasUnfinishedBusinessRegistration: true,
      },
      createdAt: '2019-06-17T11:23:59.000Z',
      businesses: ['88038e2a-90f9-11e9-a492-7200004fe4c0'],
    } as any);
  }
}

export = UsersFixture;
