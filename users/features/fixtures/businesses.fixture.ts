import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { BusinessModel, BusinessDetailModel, BusinessSlugModel } from '../../src/user';
import { CurrencyFormatEnum, StatusEnum } from '../../src/user/enums';

class BusinessesFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
    const businessDetailModel: Model<BusinessDetailModel> = this.application.get('BusinessDetailModel');
    const businessSlugModel: Model<BusinessSlugModel> = this.application.get('BusinessSlugModel');
    await businessSlugModel.create({
      _id: '88038e2a-90f9-11e9-a492-7200004fe4c0',
      slug: 'test',
      used: 2,
    } as any);
    const businessDetail1 = await businessDetailModel.create({
      _id: '88038e2a-90f9-11e9-a492-7200004fe4c0',
      companyAddress: {
        country: 'RU',
        city: 'Moscow',
        street: 'Some street',
        zipCode: '123456',
      },
      companyDetails: {
        legalForm: 'Legal Form',
        phone: '999-8888-7777',
        product: 'Some Product',
        industry: 'Some Industry',
        urlWebsite: String,
        foundationYear: String,
        employeesRange: { min: 100, max: 200 },
        status: StatusEnum.JustLooking,
        salesRange: { min: 50, max: 100 },
      },
      contactDetails: {
        salutation: 'test',
        firstName: 'test',
        lastName: 'test',
        phone: '+12315135135',
        fax: '+12315135135',
        additionalPhone: '+12315135135',
      },
      bankAccount: {
        country: 'DE',
        city: 'Hamburg',
        bankName: 'Some Bank',
        bankCode: 'SB',
        swift: 'test',
        routingNumber: '1234',
        accountNumber: '1234',
        owner: 'test',
        bic: 'bic',
        iban: 'test',
      },
    } as any);
    await businessModel.create({
      _id: '88038e2a-90f9-11e9-a492-7200004fe4c0',
      businessDetail: businessDetail1._id,
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
    const businessDetail2 = await businessDetailModel.create({
      _id: '6502b371-4cda-4f1d-af9c-f9c5c886c455',
      companyAddress: {
        country: 'RU',
        city: 'Moscow',
        street: 'Some street',
        zipCode: '123456',
      },
      companyDetails: {
        legalForm: 'Legal Form',
        phone: '999-8888-7777',
        product: 'Some Product',
        industry: 'Some Industry',
        urlWebsite: String,
        foundationYear: String,
        employeesRange: { min: 100, max: 200 },
        status: StatusEnum.JustLooking,
        salesRange: { min: 50, max: 100 },
      },
      contactDetails: {
        salutation: 'test',
        firstName: 'test',
        lastName: 'test',
        phone: '+12315135135',
        fax: '+12315135135',
        additionalPhone: '+12315135135',
      },
      bankAccount: {
        country: 'DE',
        city: 'Hamburg',
        bankName: 'Some Bank',
        bankCode: 'SB',
        swift: 'test',
        routingNumber: '1234',
        accountNumber: '1234',
        owner: 'test',
        bic: 'bic',
        iban: 'test',
      },
    } as any);
    await businessModel.create({
      _id: '6502b371-4cda-4f1d-af9c-f9c5c886c455',
      businessDetail: businessDetail2._id,
      name: 'test business 2',
      owner: '85547e38-dfe5-4282-b1ae-c5542267f39e',
      logo: 'logo',
      currentWallpaper: {
        theme: 'dark',
        wallpaper: 'wp',
      },
      currency: 'USD',
      currencyFormat: CurrencyFormatEnum.DecimalWithPoint,
      active: false,
      hidden: true,
      taxes: {
        companyRegisterNumber: '123',
        taxId: '123',
        taxNumber: '123',
        turnoverTaxAct: false,
      },
      documents: {
        commercialRegisterExcerptFilename: 'test',
      },
      contactEmails: ['test1@email.com'],
      cspAllowedHosts: ['host1'],
    } as any);
    const businessDetail3 = await businessDetailModel.create({
      _id: 'fa8b1d32-8d5c-4839-9ea6-4af777098465',
      companyAddress: {
        country: 'Russia',
        city: 'Moscow',
        street: 'Some street',
        zipCode: '123456',
      },
      companyDetails: {
        legalForm: 'Legal Form',
        phone: '999-8888-7777',
        product: 'Some Product',
        industry: 'Some Industry',
        urlWebsite: String,
        foundationYear: String,
        employeesRange: { min: 100, max: 200 },
        status: StatusEnum.JustLooking,
        salesRange: { min: 50, max: 100 },
      },
      contactDetails: {
        salutation: 'test',
        firstName: 'test',
        lastName: 'test',
        phone: '+12315135135',
        fax: '+12315135135',
        additionalPhone: '+12315135135',
      },
      bankAccount: {
        country: 'DE',
        city: 'Hamburg',
        bankName: 'Some Bank',
        bankCode: 'SB',
        swift: 'test',
        routingNumber: '1234',
        accountNumber: '1234',
        owner: 'test',
        bic: 'bic',
        iban: 'test',
      },
    } as any);
    await businessModel.create({
      _id: 'fa8b1d32-8d5c-4839-9ea6-4af777098465',
      businessDetail: businessDetail3._id,
      name: 'test business 3',
      owner: '85547e38-dfe5-4282-b1ae-c5542267f39e',
      logo: 'logo',
      currentWallpaper: {
        theme: 'dark',
        wallpaper: 'wp',
      },
      currency: 'USD',
      currencyFormat: CurrencyFormatEnum.DecimalWithPoint,
      active: true,
      hidden: true,
      taxes: {
        companyRegisterNumber: '123',
        taxId: '123',
        taxNumber: '123',
        turnoverTaxAct: false,
      },
      documents: {
        commercialRegisterExcerptFilename: 'test',
      },
      contactEmails: ['test1@email.com'],
      cspAllowedHosts: ['host1'],
    } as any);
  }
}

export = BusinessesFixture;
