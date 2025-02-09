import * as uuid from 'uuid';
import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { PartialFactory } from '@pe/cucumber-sdk/module/fixtures/helpers/partial-factory';
import {
  IntegrationInterface,
} from '../../src/integration/interfaces';
import { StatusEnum } from '@pe/business-kit';

const defaultFactory: () => any = () => {
  const seq: SequenceGenerator = new SequenceGenerator(0);
  seq.next();

  return {
    _id: uuid.v4(),
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
    country: 'DE',
    taxes: {
      companyRegisterNumber: '123',
      taxId: '123',
      taxNumber: '123',
      turnoverTaxAct: false,
    },
  };
};

export const businessFactory: PartialFactory<IntegrationInterface> = partialFactory(defaultFactory);
