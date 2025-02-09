import 'mocha';
import * as sinon from 'sinon';
import * as mongoose from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing'
import { chaiAssert, chaiExpect, matchLodash } from '../../bootstrap';
import { ApiCallModel } from '../../../src/payment-notifications/models';
import { ApiCallSchema, ApiCallSchemaName } from '../../../src/payment-notifications/schemas';
import { ApiCallService } from '../../../src/payment-notifications/services';
import { ApiCallDto } from '../../../src/payment-notifications/dto';

const expect: Chai.ExpectStatic = chaiExpect;
const assert: Chai.Assert = chaiAssert;
const _: any = matchLodash;

describe('ApiCallService', () => {
  let sandbox: sinon.SinonSandbox;
  let apiCallService: ApiCallService;

  const ApiCall: mongoose.Model<ApiCallModel> = mongoose.model(
    ApiCallSchemaName,
    ApiCallSchema,
  );

  const apiCallModel: any = {
    create: async (args: any): Promise<any> => {},
    findOne: async (conditions: any): Promise<any> => {},
    updateOne: async (conditions: any, doc: any): Promise<any> => {},
  };

  before(async () => {
    const testAppModule: TestingModule = await Test.createTestingModule({
      providers: [
        ApiCallService,
        {
          provide: 'ApiCallModel',
          useValue: apiCallModel,
        },
      ],
    }).compile();

    apiCallService = testAppModule.get<ApiCallService>(ApiCallService);
  });

  beforeEach(async () => {
    sandbox = await sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  describe('create', () => {
    it('should create and return ApiCall model', async () => {
      const apiCallDto: ApiCallDto = {
        /* tslint:disable-next-line */
        id: 'api-call-id',
        /* tslint:disable-next-line */
        cancelUrl: 'cancel-url',
        failureUrl: 'failure-url',
        noticeUrl: 'notice-url',
        pendingUrl: 'pending-url',
        successUrl: 'success-url',
      };

      sandbox.stub(apiCallModel, 'create').callsFake(async (args: any) => {
        return new ApiCall(args);
      });

      const result: any = await apiCallService.create(apiCallDto);

      const expectedResult: any = {
        _id: 'api-call-id',
        /* tslint:disable-next-line */
        cancelUrl: 'cancel-url',
        failureUrl: 'failure-url',
        noticeUrl: 'notice-url',
        pendingUrl: 'pending-url',
        successUrl: 'success-url',
      };

      assert.instanceOf(result, ApiCall);
      expect(result.toObject()).to.matchPattern(expectedResult);
    });
  });

  describe('findByApiCallId', () => {
    it('should return null when id is null', async () => {
      const result: any = await apiCallService.findByApiCallId(null);

      assert.isNull(result);
    });

    it('should return ApiCall model', async () => {
      sandbox.stub(apiCallModel, 'findOne').callsFake(
        async (conditions: any) => {
          expect(conditions).to.matchPattern({ _id: 'api-call-id' });

          return new ApiCall({ _id: 'api-call-id' });
        },
      );

      const result: any = await apiCallService.findByApiCallId('api-call-id');

      const expectedResult: any = {
        _id: 'api-call-id',
      };

      assert.instanceOf(result, ApiCall);
      expect(result.toObject()).to.matchPattern(expectedResult);
    });
  });

  describe('applyPaymentId', () => {
    it('should apply payment id to ApiCall model', async () => {
      sandbox.stub(apiCallModel, 'updateOne').callsFake(
        async (conditions: any, doc: any) => {
          expect(conditions).to.eql({ _id: 'api-call-id' });
          expect(doc).to.eql({ paymentId: 'payment-id' });
        },
      );

      await apiCallService.applyPaymentId('api-call-id', 'payment-id');
    });

    it('should not apply payment id to ApiCall model when api call id is null', async () => {
      await apiCallService.applyPaymentId(null, 'payment-id');
    });

    it('should not apply payment id to ApiCall model when payment id is null', async () => {
      await apiCallService.applyPaymentId('api-call-id', null);
    });
  });

  describe('modifyCallbackUrl', () => {
    it('should modify given callback url', async () => {
      const callbackUrl: string = 'http://success-url.com/--CALL-ID--/--PAYMENT-ID--';

      const result: any = await apiCallService.modifyCallbackUrl(callbackUrl, '111111', '222222');

      const expectedResult: string = 'http://success-url.com/111111/222222';

      expect(result).to.eq(expectedResult);
    });
  });
});
