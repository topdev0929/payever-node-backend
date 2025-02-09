import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ApplicationModule } from '../../src/app.module';
import { CurrencyModule } from '../../src/currency';

describe('Currency', () => {
  let app: INestApplication;

  const currencyModel = {
    create: () => {
    },
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [CurrencyModule, ApplicationModule],
    })
      .overrideProvider('CurrencyModel')
      .useValue(currencyModel)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  const currency = {
    code: 'EUR',
    rate: 20.19,
    name: 'Euro',
    symbol: '€',
  };
  const create = new Promise((resolve) => resolve(currency));
  jest.spyOn(currencyModel, 'create').mockImplementation(() => create);

  it('Add a currency', () => {
    return request(app.getHttpServer())
      .post('/currency')
      .set('Accept', 'application/json')
      .send({code: 'EUR', rate: 20.19})
      .expect(201)
      .expect({
        code: 'EUR', rate: 20.19, name: 'Euro', symbol: '€',
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
