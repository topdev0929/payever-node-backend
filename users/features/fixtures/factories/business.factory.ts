import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { CurrencyFormatEnum, StatusEnum } from '../../../src/user/enums';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid(),
    active: true,
    bankAccount: {
      accountNumber: '1234',
      bankCode: `SB ${seq.current}`,
      bankName: `Some Bank ${seq.current}`,
      bic: `bic ${seq.current}`,
      city: 'Hamburg',
      country: 'DE',
      iban: `test ${seq.current}`,
      owner: `test ${seq.current}`,
      routingNumber: '1234',
      swift: `test ${seq.current}`,
    },
    companyAddress: {
      city: 'Moscow',
      country: 'RU',
      street: `Street_${seq.current}`,
      zipCode: '123456',
    },
    companyDetails: {
      employeesRange: { min: seq.current, max: seq.current * 10 },
      foundationYear: `${seq.current}`,
      industry: `industry_${seq.current}`,
      legalForm: `legal_form_${seq.current}`,
      phone: `phone_${seq.current}`,
      product: `product_${seq.current}`,
      salesRange: { min: seq.current, max: seq.current * 5 },
      status: StatusEnum.JustLooking,
      urlWebsite: ` ${seq.current}`,
    },
    contactDetails: {
      additionalPhone: `+12${seq.current}`,
      fax: `+1234${seq.current}`,
      firstName: `Contact_${seq.current}`,
      lastName: `test ${seq.current}`,
      phone: `+1231${seq.current}`,
      salutation: `test ${seq.current}`,
    },
    contactEmails: [`test_${seq.current}@email.com`],
    cspAllowedHosts: [`host${seq.current}`],
    currency: 'EUR',
    currencyFormat: CurrencyFormatEnum.DecimalWithPoint,
    documents: {
      commercialRegisterExcerptFilename: `test ${seq.current}`,
    },
    hidden: false,
    logo: `Logo_${seq.current}`,
    name: `Business ${seq.current}`,
    owner: uuid(),
    taxes: {
      companyRegisterNumber: '123',
      taxId: '123',
      taxNumber: '123',
      turnoverTaxAct: false,
    },
    wallpaper: `wallpapper ${seq.current}`,

  });
};

export class BusinessFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
