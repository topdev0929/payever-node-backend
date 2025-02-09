import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { UserModel, BusinessModel } from '../../src/user';
import { Employee } from '../../src/employees/interfaces';
import { CurrencyFormatEnum } from '../../src/user/enums';

class TransferOwnershipFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const userModel: Model<UserModel> = this.application.get('UserModel');
    const businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
    const employeeModel: Model<Employee> = this.application.get('EmployeeModel');

    await userModel.create({
      _id: '8a13bd00-90f1-11e9-9f67-7200004fe4c0',
      userAccount: {
        language: 'test',
        salutation: 'test',
        firstName: 'test',
        lastName: 'test',
        phone: 'test',
        email: 'email@test1.com',
        birthday: '2019-06-17T11:23:59.000Z',
        createdAt: '2019-06-17T11:23:59.000Z',
        logo: 'test',
        hasUnfinishedBusinessRegistration: true,
      },
      createdAt: '2019-06-17T11:23:59.000Z',
      businesses: ['88038e2a-90f9-11e9-a492-7200004fe4c0'],
    } as any);

    await userModel.create({
      _id: '85547e38-dfe5-4282-b1ae-c5542267f39e',
      userAccount: {
        language: 'test',
        salutation: 'test',
        firstName: 'test',
        lastName: 'test',
        phone: 'test',
        email: 'email@test2.com',
        birthday: '2019-06-17T11:23:59.000Z',
        createdAt: '2019-06-17T11:23:59.000Z',
        logo: 'test',
      },
      createdAt: '2019-06-17T11:23:59.000Z',
      businesses: ['6502b371-4cda-4f1d-af9c-f9c5c886c455', 'fa8b1d32-8d5c-4839-9ea6-4af777098465'],
    } as any);


    await businessModel.create({
        _id: '88038e2a-90f9-11e9-a492-7200004fe4c0',
        businessDetail: '8a13bd00-90f1-11e9-9f67-7200004fe4c0',
        name: 'test business',
        owner: '8a13bd00-90f1-11e9-9f67-7200004fe4c0',
        logo: 'logo',
        currentWallpaper: {
          theme: 'dark',
          wallpaper: 'wp',
        },
        currency: 'eur',
        currencyFormat: CurrencyFormatEnum.DecimalWithPoint,
        active: true,
        hidden: false,
        taxes: {
          companyRegisterNumber: '123',
          taxId: '123',
          taxNumber: '123',
          turnoverTaxAct: false,
        },
        documents: {
          commercialRegisterExcerptFilename: 'test',
        },
        themeSettings: {
          primaryColor: 'test',
          primaryTransparency: 'test',
          secondaryColor: 'test',
          secondaryTransparency: 'test',
        },
        contactEmails: ['test1@email.com'],
        cspAllowedHosts: ['host1'],
      } as any);


      await businessModel.create({
        _id: '88038e2a-90f9-11e9-a492-7200004fe4c1',
        businessDetail: '8a13bd00-90f1-11e9-9f67-7200004fe4c0',
        name: 'test business',
        owner: '85547e38-dfe5-4282-b1ae-c5542267f391',
        logo: 'logo',
        currentWallpaper: {
          theme: 'dark',
          wallpaper: 'wp',
        },
        currency: 'eur',
        currencyFormat: CurrencyFormatEnum.DecimalWithPoint,
        active: true,
        hidden: false,
        taxes: {
          companyRegisterNumber: '123',
          taxId: '123',
          taxNumber: '123',
          turnoverTaxAct: false,
        },
        documents: {
          commercialRegisterExcerptFilename: 'test',
        },
        themeSettings: {
          primaryColor: 'test',
          primaryTransparency: 'test',
          secondaryColor: 'test',
          secondaryTransparency: 'test',
        },
        contactEmails: ['test1@email.com'],
        cspAllowedHosts: ['host1'],
      } as any);

    await employeeModel.create({
      _id: '8a13bd00-90f1-11e9-9f67-7200004fe4c2',
      firstName: 'test',
      lastName: 'test',
      phone: 'test',
      email: 'email@test3.com',
      userId: '8a13bd00-90f1-11e9-9f67-7200004fe4c1',
      positions: [
        {
          businessId: '88038e2a-90f9-11e9-a492-7200004fe4c0',
          status: 1,
          positionType: 'Staff'
        },

      ]
    } as any);

  }
}

export = TransferOwnershipFixture;