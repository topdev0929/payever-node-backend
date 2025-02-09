import { Logger } from '@nestjs/common';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { CurrencyUpdaterCron } from '../../../../src/common/cron';
import { CurrencyModel, CurrencyService } from '@pe/common-sdk';
import { CommonDataEventProducer } from '../../../../src/common/producer';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as chai from 'chai';

chai.use(sinonChai);

const expect: Chai.ExpectStatic = chai.expect;

describe('Currency Updater Service', () => {
  let currencyUpdaterCron: CurrencyUpdaterCron;
  let currencyService: CurrencyService;
  let sandbox: sinon.SinonSandbox;
  let commonDataEventProducer: CommonDataEventProducer;

  const mockedAxios: MockAdapter = new MockAdapter(axios);

  const logger: any = {
    errorsList: [],
    logMessagesList: [],

    log: (message: string): void => {
      logger.logMessagesList.push(message);
    },

    error: (message: string): void => {
      logger.errorsList.push(message);
    },
  };



  before(async () => {
    const cbrUrl: string =
      'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';

    const cbrResponse: string =
      '<?xml version="1.0" encoding="UTF-8"?>' +
      '<gesmes:Envelope xmlns:gesmes="http://www.gesmes.org/xml/2002-08-01" ' +
      'xmlns="http://www.ecb.int/vocabulary/2002-08-01/eurofxref">' +
      '<gesmes:subject>Reference rates</gesmes:subject>' +
      '<gesmes:Sender>' +
      '<gesmes:name>European Central Bank</gesmes:name>' +
      '</gesmes:Sender>' +
      '<Cube>' +
      "<Cube time='2019-01-07'>" +
      "<Cube currency='USD' rate='1.1445'/>" +
      "<Cube currency='GBP' rate='0.89720'/>" +
      "<Cube currency='HUF' rate='321.11'/>" +
      "<Cube currency='SEK' rate='10.2235'/>" +
      "<Cube currency='CHF' rate='1.1227'/>" +
      '</Cube>' +
      '</Cube>' +
      '</gesmes:Envelope>';

    mockedAxios.onGet(cbrUrl).reply(200, cbrResponse);

    const module: TestingModuleBuilder = await Test.createTestingModule({
      providers: [
        CurrencyUpdaterCron,
        {
          provide: CurrencyService,
          useValue: {
            updateRate: async (): Promise<CurrencyModel> => { },
          },
        },
        {
          provide: CommonDataEventProducer,
          useValue: {
            produceUpdateEvent: (): void => {},
          },
        },
        {
          provide: Logger,
          useValue: logger,
        },
      ],
    }).compile();

    currencyUpdaterCron = module.get(CurrencyUpdaterCron);
    currencyService = module.get(CurrencyService);
    commonDataEventProducer = module.get(CommonDataEventProducer);

  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(async () => {
    sandbox.restore();
    sandbox = undefined;
  });


  describe('Update currencies', () => {
    it('should update currencies from the url', async () => {
      sandbox.stub(currencyService, 'updateRate').resolves({id: 'CURRENCY', rate: 1});
      sandbox.stub(commonDataEventProducer, 'produceUpdateEvent').resolves(null);

      await currencyUpdaterCron.updateCurrencies();

      expect(currencyService.updateRate).to.be.callCount(6);
    });
  });
});
