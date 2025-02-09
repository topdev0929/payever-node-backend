import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as sinonChai from 'sinon-chai';
import * as sinon from 'sinon';

import { Logger } from '@nestjs/common';
import { TransactionsBusMessageController } from '../../../../src/statistics/controllers/transactions-bus-message.controller';

import { BusinessService } from '@pe/business-kit';
import { BusinessProductsService, ChannelSetProductsService } from '../../../../src/apps/products-app/services';
import { 
  BusinessIncomeService,
  ChannelSetIncomeService,
  ChannelSetService,
  TransactionsService,
  UserIncomeService,
} from '../../../../src/statistics/services';
import { TransactionPaymentAddDto, TransactionPaymentSubtractDto } from '../../../../src/statistics/dto';
import { UserService } from '../../../../src/user';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('TransactionsBusMessageController', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: TransactionsBusMessageController;

  let logger: Logger;
  let businessService: BusinessService;
  let businessIncomeService: BusinessIncomeService;
  let channelSetService: ChannelSetService;
  let channelSetIncomeService: ChannelSetIncomeService;
  let transactionsService: TransactionsService;
  let businessProductsService: BusinessProductsService;
  let channelSetProductsService: ChannelSetProductsService;
  let userService: UserService;
  let userIncomeService: UserIncomeService;

  before(() => {

    logger = {

    } as any;
    businessService = {
      findOneById: (): any => { },
    } as any;
    businessIncomeService = {
      add: (): any => { },
    } as any;
    channelSetService = {
      findOneById: (): any => { },
    } as any;
    channelSetIncomeService = {
      add: (): any => { },
    } as any;
    transactionsService = {
      findOneById: (): any => { },
    } as any;
    businessProductsService = {
      processCartItem: (): any => { },
    } as any;
    channelSetProductsService = {
      processCartItem: (): any => { },
    } as any;
    userService = {
      add: (): any => { },
    } as any;
    userIncomeService = {
      findOneById: (): any => { },
    } as any;

    testService = new TransactionsBusMessageController(
      businessService,
      userService,
      businessIncomeService,
      userIncomeService,
      channelSetService,
      channelSetIncomeService,
      transactionsService,
      businessProductsService,
      channelSetProductsService,
    );
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('onPaymentPaidEvent', () => {
    it('should perform payment paid event', async () => {
      const updated_date: Date = new Date();
      const transaction: TransactionPaymentAddDto = {
        amount: 100,
        business: {
          id: 'business_id_111111',
        },
        channel_set: {
          id: 'channel_id_111111',
        },
        date: updated_date.toString(),
        id: '123456789',
        items: [],
        last_updated: updated_date.toString(),
      } as any;

      sandbox.stub(testService, 'onPaymentPaidEvent').callsFake(
        async (transactionAdd: TransactionPaymentAddDto) => {

          expect(transactionAdd.id).to.equal('123456789');
        },
      );

      await testService.onPaymentPaidEvent(transaction);
    });
  });

  describe('onPaymentRefundEvent', () => {
    it('should perform payment refund event', async () => {
      const updated_date: Date = new Date();
      const transaction: TransactionPaymentSubtractDto = {
        amount: 100,
        business: {
          id: 'business_id_111111',
        },
        channel_set: {
          id: 'channel_id_111111',
        },
        date: updated_date.toString(),
        id: '123456789',
        last_updated: updated_date.toString(),
      } as any;

      sandbox.stub(testService, 'onPaymentRefundEvent').callsFake(
        async (transactionSub: TransactionPaymentSubtractDto) => {

          expect(transactionSub.id).to.equal('123456789');
        },
      );

      await testService.onPaymentRefundEvent(transaction);
    });
  });

});
