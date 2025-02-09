/* tslint:disable:object-literal-sort-keys no-duplicate-string no-big-function */
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { Model } from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { ExchangeCalculator, ExchangeCalculatorFactory } from '../../../../src/transactions/currency';
import { ListQueryDto, PagingDto } from '../../../../src/transactions/dto';
import { TransactionModel } from '../../../../src/transactions/models';
import { MongoSearchService } from '../../../../src/transactions/services';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('MongoSearchService', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: MongoSearchService;
  let transactionModel: Model<TransactionModel>;
  let exchangeCalculator: ExchangeCalculator;
  let exchangeCalculatorFactory: ExchangeCalculatorFactory;

  before(() => {
    exchangeCalculator = {
      getCurrencyExchangeRate: (): any => { },
    } as any;
    exchangeCalculatorFactory = {
      create: (): any => { },
    } as any;

    transactionModel = {
      find(): any { return this; },
      limit(): any { return this; },
      skip(): any { return this; },
      sort(): any { return this; },
      aggregate(): any { return this; },
      countDocuments(): any { },
      distinct(): any { },
    } as any;

    testService = new MongoSearchService(transactionModel, exchangeCalculatorFactory);
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('getResult()', () => {
    it('should return result with No currency in listDto', async () => {
      const listDto: ListQueryDto = new ListQueryDto();
      listDto.filters = {
        channel_set_uuid: {
          value: '8b609edb-f61e-4c9e-951b-5d4f9a1b5b52',
        },
        id: [
          {
            condition: 'is',
            value: [
              'search',
            ],
          },
          {
            value: { },
          },
          { },
        ],
        uuid: {
          value: { },
        },
      };
      listDto.search = 'search_keyword';

      sandbox.stub(transactionModel, 'countDocuments').resolves(10);
      sandbox.stub(testService, 'search').resolves({ });
      sandbox.stub(transactionModel, 'aggregate').resolves([
        {
          _id: '7eefae05-f504-4d28-9720-f5e5195227ff',
          total: 12,
        },
      ]);
      sandbox.stub(exchangeCalculatorFactory, 'create').returns(exchangeCalculator);
      sandbox.stub(exchangeCalculator, 'getCurrencyExchangeRate').resolves(1.26);
      sandbox.stub(transactionModel, 'distinct')
        .onFirstCall().resolves([{ statuses: ['SUCEEDED'] }])
        .onSecondCall().resolves([{ specific_statuses: ['PENDING'] }]);

      const result: any = await testService.getResult(listDto);

      const expectedFilter: any = {
        channel_set_uuid: '8b609edb-f61e-4c9e-951b-5d4f9a1b5b52',
        '$and': [{ id: { $in: ['search'] } }],
        '$or': [
          { merchant_name: /search_keyword/i },
          { merchant_email: /search_keyword/i },
          { customer_name: /search_keyword/i },
          { customer_email: /search_keyword/i },
          { reference: /search_keyword/i },
          { original_id: /search_keyword/i },
          { santander_applications: /search_keyword/i },
        ],
      };

      expect(transactionModel.countDocuments).calledOnceWithExactly(expectedFilter);
      expect(transactionModel.aggregate).calledWithExactly(
        [
          { $match: expectedFilter },
          { '$group': { _id: null, total: { '$sum': '$total' } } },
        ],
      );
      expect(result).to.deep.eq(
        {
          collection: { },
          filters: { },
          pagination_data: { amount: 12, amount_currency: undefined, page: 1, total: 10 },
          usage: { specific_statuses: [{ specific_statuses: ['PENDING'] }], statuses: [{ statuses: ['SUCEEDED'] }] },
        });
      expect(testService.search).calledOnceWith(expectedFilter);
    });

    it('should return result with currency in listDto', async () => {
      const listDto: ListQueryDto = new ListQueryDto();
      listDto.filters = {
        channel_set_uuid: {
          value: '8b609edb-f61e-4c9e-951b-5d4f9a1b5b52',
        },
        id: [
          {
            condition: 'is',
            value: [
              'search',
            ],
          },
          {
            value: { },
          },
          { },
        ],
        uuid: {
          value: { },
        },
      };
      listDto.search = 'search_keyword';
      listDto.currency = 'EUR';

      sandbox.stub(transactionModel, 'countDocuments').resolves(10);
      sandbox.stub(testService, 'search').resolves({ });
      sandbox.stub(transactionModel, 'aggregate').resolves([
        {
          _id: '7eefae05-f504-4d28-9720-f5e5195227ff',
          total: 12,
        },
      ]);
      sandbox.stub(exchangeCalculatorFactory, 'create').returns(exchangeCalculator);
      sandbox.stub(exchangeCalculator, 'getCurrencyExchangeRate').resolves(1.26);
      sandbox.stub(transactionModel, 'distinct')
        .onFirstCall().resolves([{ statuses: ['SUCEEDED'] }])
        .onSecondCall().resolves([{ specific_statuses: ['PENDING'] }]);

      const result: any = await testService.getResult(listDto);

      const expectedFilter: any = {
        channel_set_uuid: '8b609edb-f61e-4c9e-951b-5d4f9a1b5b52',
        '$and': [{ id: { $in: ['search'] } }],
        '$or': [
          { merchant_name: /search_keyword/i },
          { merchant_email: /search_keyword/i },
          { customer_name: /search_keyword/i },
          { customer_email: /search_keyword/i },
          { reference: /search_keyword/i },
          { original_id: /search_keyword/i },
          { santander_applications: /search_keyword/i },
        ],
      };

      expect(transactionModel.countDocuments).calledOnceWithExactly(expectedFilter);
      expect(transactionModel.aggregate).calledWithExactly(
        [
          { $match: expectedFilter },
          { '$group': { _id: '$currency', total: { '$sum': '$total' } } },
        ],
      );
      expect(result).to.deep.eq(
        {
          collection: { },
          filters: { },
          pagination_data: { amount: 12, amount_currency: 'EUR', page: 1, total: 10 },
          usage: { specific_statuses: [{ specific_statuses: ['PENDING'] }], statuses: [{ statuses: ['SUCEEDED'] }] },
        });
      expect(testService.search).calledOnceWith(expectedFilter);

    });

    it('should return result with currency in listDto no and search', async () => {
      const listDto: ListQueryDto = new ListQueryDto();
      listDto.filters = {
        channel_set_uuid: {
          value: '8b609edb-f61e-4c9e-951b-5d4f9a1b5b52',
        },
        id: [
          {
            value: { },
          },
          { },
        ],
        uuid: {
          value: { },
        },
      };
      listDto.search = 'search_keyword';
      listDto.currency = 'EUR';

      sandbox.stub(transactionModel, 'countDocuments').resolves(10);
      sandbox.stub(testService, 'search').resolves({ });
      sandbox.stub(transactionModel, 'aggregate').resolves([
        {
          _id: '7eefae05-f504-4d28-9720-f5e5195227ff',
          total: 12,
        },
      ]);
      sandbox.stub(exchangeCalculatorFactory, 'create').returns(exchangeCalculator);
      sandbox.stub(exchangeCalculator, 'getCurrencyExchangeRate').resolves(1.26);
      sandbox.stub(transactionModel, 'distinct')
        .onFirstCall().resolves([{ statuses: ['SUCEEDED'] }])
        .onSecondCall().resolves([{ specific_statuses: ['PENDING'] }]);

      const result: any = await testService.getResult(listDto);

      const expectedFilter: any = {
        channel_set_uuid: '8b609edb-f61e-4c9e-951b-5d4f9a1b5b52',
        '$or': [
          { merchant_name: /search_keyword/i },
          { merchant_email: /search_keyword/i },
          { customer_name: /search_keyword/i },
          { customer_email: /search_keyword/i },
          { reference: /search_keyword/i },
          { original_id: /search_keyword/i },
          { santander_applications: /search_keyword/i },
        ],
      };

      expect(transactionModel.countDocuments).calledOnceWithExactly(expectedFilter);
      expect(transactionModel.aggregate).calledWithExactly(
        [
          { $match: expectedFilter },
          { '$group': { _id: '$currency', total: { '$sum': '$total' } } },
        ],
      );
      expect(result).to.deep.eq(
        {
          collection: { },
          filters: { },
          pagination_data: { amount: 12, amount_currency: 'EUR', page: 1, total: 10 },
          usage: { specific_statuses: [{ specific_statuses: ['PENDING'] }], statuses: [{ statuses: ['SUCEEDED'] }] },
        });
      expect(testService.search).calledOnceWith(expectedFilter);

    });

    it('should return result with No filter and search in listDto', async () => {
      const listDto: ListQueryDto = new ListQueryDto();
      listDto.filters = null;
      listDto.search = null;
      listDto.currency = null;

      sandbox.stub(transactionModel, 'countDocuments').resolves(10);
      sandbox.stub(testService, 'search').resolves({ });
      sandbox.stub(transactionModel, 'aggregate').resolves(null);

      sandbox.stub(exchangeCalculatorFactory, 'create').returns(exchangeCalculator);
      sandbox.stub(exchangeCalculator, 'getCurrencyExchangeRate').resolves(1.26);
      sandbox.stub(transactionModel, 'distinct')
        .onFirstCall().resolves([{ statuses: ['SUCEEDED'] }])
        .onSecondCall().resolves([{ specific_statuses: ['PENDING'] }]);

      const result: any = await testService.getResult(listDto);

      const expectedFilter: any = { };

      expect(transactionModel.countDocuments).calledOnceWithExactly(expectedFilter);
      expect(transactionModel.aggregate).calledWithExactly(
        [
          { $match: expectedFilter },
          { '$group': { _id: null, total: { '$sum': '$total' } } },
        ],
      );
      expect(result).to.deep.eq(
        {
          collection: { },
          filters: { },
          pagination_data: { amount: 0, amount_currency: null, page: 1, total: 10 },
          usage: { specific_statuses: [{ specific_statuses: ['PENDING'] }], statuses: [{ statuses: ['SUCEEDED'] }] },
        });
      expect(testService.search).calledOnceWith(expectedFilter);
    });

    it('should return result with No taxe rate', async () => {
      const listDto: ListQueryDto = new ListQueryDto();
      listDto.filters = null;
      listDto.search = null;
      listDto.currency = 'EUR';

      sandbox.stub(transactionModel, 'countDocuments').resolves(10);
      sandbox.stub(testService, 'search').resolves({ });
      sandbox.stub(transactionModel, 'aggregate').resolves([
        {
          _id: '7eefae05-f504-4d28-9720-f5e5195227ff',
          total: 12,
        },
      ]);

      sandbox.stub(exchangeCalculatorFactory, 'create').returns(exchangeCalculator);
      sandbox.stub(exchangeCalculator, 'getCurrencyExchangeRate').resolves(0);
      sandbox.stub(transactionModel, 'distinct')
        .onFirstCall().resolves([{ statuses: ['SUCEEDED'] }])
        .onSecondCall().resolves([{ specific_statuses: ['PENDING'] }]);

      const result: any = await testService.getResult(listDto);

      const expectedFilter: any = { };

      expect(transactionModel.countDocuments).calledOnceWithExactly(expectedFilter);
      expect(transactionModel.aggregate).calledWithExactly(
        [
          { $match: expectedFilter },
          { '$group': { _id: '$currency', total: { '$sum': '$total' } } },
        ],
      );
      expect(result).to.deep.eq(
        {
          collection: { },
          filters: { },
          pagination_data: { amount: 12, amount_currency: 'EUR', page: 1, total: 10 },
          usage: { specific_statuses: [{ specific_statuses: ['PENDING'] }], statuses: [{ statuses: ['SUCEEDED'] }] },
        });
      expect(testService.search).calledOnceWith(expectedFilter);
    });
  });

  describe('search()', () => {
    it('should search for transactions', async () => {
      sandbox.spy(transactionModel, 'find');

      await testService.search(
        { $and: { key1: 'value1' } },
        { key: 'value' },
        new PagingDto(2, 4),
      );
      expect(transactionModel.find).calledOnceWith({ $and: { key1: 'value1' } });

    });
  });

  describe('distinctFieldValues()', () => {
    it('should find for transactions', async () => {
      sandbox.spy(transactionModel, 'find');

      await testService.distinctFieldValues('id');
      expect(transactionModel.find).calledOnceWith({ });

    });
  });
});
