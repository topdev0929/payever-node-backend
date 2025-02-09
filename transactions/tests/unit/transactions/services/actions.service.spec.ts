// tslint:disable:no-identical-functions
import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { Logger } from '@nestjs/common';
import { ActionsRetriever, ThirdPartyCallerService } from '../../../../src/transactions/services';
import { ActionItemInterface } from '../../../../src/transactions/interfaces';
import { TransactionUnpackedDetailsInterface } from '../../../../src/transactions/interfaces/transaction';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('ActionRetriever', () => {
  let sandbox: sinon.SinonSandbox;
  let testService: ActionsRetriever;
  let thirdPartyCallerService: ThirdPartyCallerService;
  let logger: Logger;

  const actions: ActionItemInterface[] = [
    {
      action: 'Action 1',
      enabled: true,
      isOptional: false,
      partialAllowed: false,
    },
    {
      action: 'Action 2',
      enabled: false,
      isOptional: true,
      partialAllowed: true,
    },
  ];

  before(() => {
    logger = {
      error: (): any => { },
    } as any;

    thirdPartyCallerService = {
      getActionsList: (): any => { },
    } as any;

    testService = new ActionsRetriever(thirdPartyCallerService, logger);
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('retrive()', () => {
    it('should retrieve actions', async () => {
      sandbox.stub(thirdPartyCallerService, 'getActionsList').resolves(actions);
      const result: ActionItemInterface[] = await testService.retrieve({ } as any);
      expect(result).to.eq(actions);
    });

    it('should retrieve actions type instant_payment', async () => {
      sandbox.stub(thirdPartyCallerService, 'getActionsList').resolves(actions);
      const result: ActionItemInterface[] = await testService.retrieve({ type: 'instant_payment'} as any);
      expect(result).to.deep.eq(actions);
    });

    it('should return 0 actions when messaging service throws error', async () => {
      sandbox.stub(thirdPartyCallerService, 'getActionsList').throws({
        message: 'error occured',
        stack: 'stract trace fake',
      });
      expect(
        await testService.retrieve({ } as any),
      ).to.throw;
    });
  });

  describe('retrieveFakeActions() for STATUS_ACCEPTED', () => {
    it('should retrieve fake  actions', async () => {
      const unpackaedTransaction: TransactionUnpackedDetailsInterface = {
        status: 'STATUS_ACCEPTED',
      } as any;
      const actionItem: ActionItemInterface[] = testService.retrieveFakeActions(unpackaedTransaction);
      expect(actionItem).to.deep.eq([
        {
          action: 'refund',
          description: undefined,
          enabled: true,
          isOptional: false,
          partialAllowed: false,
        },
        {
          action: 'cancel',
          description: undefined,
          enabled: true,
          isOptional: false,
          partialAllowed: false,
        },
        {
          action: 'shipping_goods',
          description: 'transactions.actions.shipping_goods.description',
          enabled: true,
          isOptional: false,
          partialAllowed: false,
        },
      ]);
    });
  });

  it('should retrive fake actions for STATUS_PAID', async () => {
    const unpackaedTransaction: TransactionUnpackedDetailsInterface = {
      status: 'STATUS_PAID',
    } as any;
    expect(
      testService.retrieveFakeActions(unpackaedTransaction),
    ).to.deep.eq([]);
  });

  it('should retrive fake actions for UNKNOWN_STATUS', async () => {
    const unpackaedTransaction: TransactionUnpackedDetailsInterface = {
      status: 'UNKNOWN_STATUS',
    } as any;
    expect(
      testService.retrieveFakeActions(unpackaedTransaction),
    ).to.deep.eq([]);
  });

});
