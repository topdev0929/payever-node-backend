import { Logger } from '@nestjs/common';
import { ValuesService } from '@pe/common-sdk';
import { DelayRemoveClient, ElasticSearchClient } from '@pe/elastic-kit';
import { EventDispatcher, RabbitMqClient } from '@pe/nest-kit';
import { Mutex } from '@pe/nest-kit/modules/mutex';
import { NotificationsEmitter } from '@pe/notifications-sdk';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { Model } from 'mongoose';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';

import { ChannelsWithTransactionCountInterface, TransactionPackedDetailsInterface } from '../../../../src/transactions/interfaces';
import { HistoryCommonModel, TransactionModel } from '../../../../src/transactions/models';
import { TransactionsNotifier } from '../../../../src/transactions/notifiers';
import { AuthEventsProducer } from '../../../../src/transactions/producer';
import { TransactionsService } from '../../../../src/transactions/services';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('TransactionsService', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: TransactionsService;
  let transactionModel: Model<TransactionModel>;
  let notificationsEmitter: NotificationsEmitter;
  let elasticSearchClient: ElasticSearchClient;
  let notifier: TransactionsNotifier;
  let delayRemoveClient: DelayRemoveClient;
  let authEventsProducer: AuthEventsProducer;
  let rabbitClient: RabbitMqClient;
  let mutex: Mutex;
  let logger: Logger;
  let eventDispatcher: EventDispatcher;

  const transaction: TransactionModel = {
    id: uuid.v4(),
    uuid: uuid.v4(),
    amount: 1,
    total: 12,
    toObject(): any { return this },
    items: [],
    history: [],
  } as any;

  before(() => {
    transactionModel = {
      create: (): any => { },
      find: (): any => { },
      findOne: (): any => { },
      findOneAndRemove: (): any => { },
      findOneAndUpdate: (): any => { },
      limit(): any { return this },
      sort(): any { return this },
      aggregate(): any { return this; },
    } as any;

    elasticSearchClient = {
      singleIndex: (): any => { },
    } as any;

    notifier = {
      sendNewTransactionNotification: (): any => { },
    } as any;

    delayRemoveClient = {
      deleteByQuery: (): any => { },
    } as any;

    rabbitClient = {
      send: (): any => { },
    } as any;

    authEventsProducer = {
      getSellerName: (): any => { },
    } as any;

    mutex = {
      lock: (namespace: string, id: string, callback: () => Promise<any>): any => callback(),
    } as any;

    logger = {
      log: (): any => { },
      warn: (): any => { },
    } as any;

    eventDispatcher = {
      dispatch: (): any => { },
    } as any;

    testService = new TransactionsService(
      transactionModel,
      notificationsEmitter,
      authEventsProducer,
      notifier,
      mutex,
      logger,
      eventDispatcher,
    );
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('create()', () => {
    it('should create transactionModel', async () => {
      const transactionDto: TransactionPackedDetailsInterface = {
        id: uuid.v4(),
        uuid: uuid.v4(),
      } as any;

      sandbox.stub(transactionModel, 'create').resolves(transaction);
      expect(
        await testService.create(transactionDto),
      ).to.equal(transaction);
    });

    it('should throw  error while creating transactionModel', async () => {
      const transactionDto: TransactionPackedDetailsInterface = {
      } as any;

      sandbox.stub(transactionModel, 'create').throws({
        code: 123,
        name: 'SomeError',
      });
      sandbox.stub(transactionModel, 'findOne').resolves(transaction);
      const spy: sinon.SinonSpy = sandbox.spy(testService, 'create');
      try {
        await testService.create(transactionDto);
      } catch (e) { }
      expect(spy.threw());
    });

    it('should create by simple transactionModel', async () => {
      const transactionDto: TransactionPackedDetailsInterface = {
        id: uuid.v4(),
        uuid: uuid.v4(),
      } as any;

      sandbox.stub(transactionModel, 'create').resolves(transaction);
      expect(
        await testService.create(transactionDto),
      ).to.equal(transaction);
    });
  });

  describe('updateByUuid()', () => {
    it('should update transaction Model by uuid', async () => {
      const transactionDto: TransactionPackedDetailsInterface = {
        id: uuid.v4(),
      } as any;

      sandbox.stub(transactionModel, 'findOneAndUpdate').resolves(transaction);
      expect(
        await testService.updateByUuid(transaction.id, transactionDto),
      ).to.equal(transaction);
    });

    it('should should throw error', async () => {
      const transactionDto: TransactionPackedDetailsInterface = {
        id: uuid.v4(),
      } as any;

      const transaction: TransactionModel = {
        id: transactionDto.id,
        uuid: uuid.v4(),
        amount: 1,
        total: 12,
        toObject(): any { return this },
        items: [],
        history: [],
      } as any;

      sandbox.stub(transactionModel, 'findOneAndUpdate').throws({
        code: 100,
        name: 'SomeOtherError',
      });

      const spy: sinon.SinonSpy = sandbox.spy(testService, 'updateByUuid');
      try {
        await testService.updateByUuid(transaction.id, transactionDto);
      } catch (e) { }
      expect(spy.threw());
    });

    it('should update simple transaction Model by uuid', async () => {
      const transactionDto: TransactionPackedDetailsInterface = {
        id: null,
      } as any;

      sandbox.stub(transactionModel, 'findOneAndUpdate').resolves(transaction);
      expect(
        await testService.updateByUuid(transaction.id, transactionDto),
      ).to.equal(transaction);
    });

  });

  describe('updateHistoryByUuid()', () => {
    it('should update history by uuid', async () => {


      const transactionHistory: HistoryCommonModel = {} as any;
      sandbox.stub(transactionModel, 'findOneAndUpdate').resolves(transaction)
      expect(
        await testService.updateHistoryByUuid(transaction.id, [transactionHistory]),
      ).to.equal(transaction);
    });
  });

  describe('findModelByUuid', () => {
    it('should return transaction Model by uuid', async () => {
      //sandbox.stub(testService, 'findModelByUuid').resolves(transaction);
       sandbox.stub(testService, 'findModelByParams').resolves(transaction);
      expect(
        await testService.findModelByUuid(transaction.uuid),
      ).to.equal(transaction);
    });
  });

  describe('getChannelsWithTransactionsCount', () => {
    it('should return list of channels with number of the transactions', async () => {
      const channels: Array<Omit<ChannelsWithTransactionCountInterface, 'transactionCount'>> = [
        {
          icon: 'icon',
          label: 'label',
          name: 'pos',
        }
      ];
      sandbox.stub(ValuesService, 'getChannelValuesDescriptions').returns(channels);
      sandbox.stub(transactionModel, 'aggregate').resolves([
        {
          _id: 'pos',
          transactionCount: 12,
        },
        {
          _id: 'link',
          transactionCount: 14,
        },
      ]);

      expect(
        await testService.getChannelsWithTransactionsCount('businessId'),
      ).to.deep.eq([{
        ...channels[0],
        transactionCount: 12,
      }]);
    });
  });

  describe('findModelByParams', () => {
    it('should return transaction Model by uuid', async () => {

      let querySort: any = {
        sort: (): any => { },
      } as any;
      let queryLimit: any = {
        limit: (): any => { },
      } as any;

      sandbox.stub(transactionModel, 'find').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').resolves([transaction]);

      expect(
        await testService.findModelByParams({ id: transaction.id }),
      ).to.equal(transaction);
    });

    it('should return null transaction Model by uuid', async () => {
      let querySort: any = {
        sort: (): any => { },
      } as any;
      let queryLimit: any = {
        limit: (): any => { },
      } as any;

      sandbox.stub(transactionModel, 'find').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').resolves(null);

      expect(
        await testService.findModelByParams({ id: transaction.id }),
      ).to.equal(null);
    });

    it('should return empty transaction Model by uuid', async () => {
      let querySort: any = {
        sort: (): any => { },
      } as any;
      let queryLimit: any = {
        limit: (): any => { },
      } as any;

      sandbox.stub(transactionModel, 'find').returns(querySort);
      sandbox.stub(querySort, 'sort').returns(queryLimit);
      sandbox.stub(queryLimit, 'limit').resolves([]);

      expect(
        await testService.findModelByParams({ id: transaction.id }),
      ).to.equal(null);
    });
  });

  describe('findCollectionByParams', () => {
    it('should return transaction Models by uuid', async () => {
      sandbox.stub(transactionModel, 'find').resolves([transaction]);
      expect(
        await testService.findCollectionByParams({ amount: transaction.amount }),
      ).to.deep.equal([transaction]);
    });
  });

  describe('findUnpackedByUuid', () => {
    it('should return transaction unpacked by uuid', async () => {
      sandbox.stub(transactionModel, 'findOne').resolves(transaction);
      await testService.findCollectionByParams({ amount: transaction.amount });
    });
  });

  describe('findUnpackedByParams()', () => {
    it('should find unpacked transaction details by params', async () => {
      sandbox.stub(transactionModel, 'findOne').resolves(transaction);
      await testService.findUnpackedByParams({});
    });
    it('should find unpacked transaction details by params', async () => {
      sandbox.stub(transactionModel, 'findOne').resolves(null);
      await testService.findUnpackedByParams({});
    });
  });

  describe('findAll()', () => {
    it('should find all transaction model instances by businessid', async () => {
      sandbox.stub(transactionModel, 'find');
      await testService.findAll(transaction.business_uuid);
      expect(transactionModel.find).calledOnceWithExactly({ business_uuid: transaction.business_uuid });
    });
  });

  describe('removeByUuid()', () => {
    it('should remove transaction model by uuid', async () => {
      sandbox.stub(transactionModel, 'findOneAndRemove').resolves(transaction);
      await testService.removeByUuid(transaction._id);

    });

    it('should remove transaction model by uuid', async () => {
      sandbox.stub(transactionModel, 'findOneAndRemove').resolves(null);
      await testService.removeByUuid(transaction._id);
    });
  });

  describe('pushHistoryRecord()', () => {
    it('should history record to transaction', async () => {
      sandbox.stub(transactionModel, 'findOneAndUpdate').resolves(transaction);
      await testService.pushHistoryRecord(
        transaction,
        {
          action: 'delete',
        } as any,
      )
      expect(transactionModel.findOneAndUpdate).calledOnce;
    })
  });

  describe('setShippingOrderProcessed()', () => {
    it('should set shipping orer processed to true', async () => {
      sandbox.spy(transactionModel, 'findOneAndUpdate');
      await testService.setShippingOrderProcessed(transaction._id);
      expect(transactionModel.findOneAndUpdate).calledOnceWith(
        { uuid: transaction._id },
        {
          $set: {
            is_shipping_order_processed: true,
          },
        },
      )
    })
  });

  describe('findUnpackedByUuid()', () => {
    it('should find unpackedby uuid', async () => {
      sandbox.stub(testService, 'findUnpackedByParams')
      await testService.findUnpackedByUuid(transaction._id);
    });
  });
});
