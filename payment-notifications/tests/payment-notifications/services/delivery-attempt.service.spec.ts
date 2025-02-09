import 'mocha';
import * as sinon from 'sinon';
import * as mongoose from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { chaiAssert, chaiExpect, matchLodash } from '../../bootstrap';
import { DeliveryAttemptModel } from '../../../src/payment-notifications/models';
import {
  DeliveryAttemptSchema,
  DeliveryAttemptSchemaName,
} from '../../../src/payment-notifications/schemas';
import { DeliveryAttemptService } from '../../../src/payment-notifications/services';
import { DeliveryAttemptDto } from '../../../src/payment-notifications/dto';
import { PaymentNotificationStatusesEnum } from '../../../src/payment-notifications/enums';

const expect: Chai.ExpectStatic = chaiExpect;
const assert: Chai.Assert = chaiAssert;
const _: any = matchLodash;

describe('DeliveryAttemptService', () => {
  let sandbox: sinon.SinonSandbox;
  let deliveryAttemptService: DeliveryAttemptService;

  const DeliveryAttempt: any = mongoose.model(
    DeliveryAttemptSchemaName,
    DeliveryAttemptSchema,
  );

  const deliveryAttemptModel: any = {
    create: async (args: any): Promise<any> =>  { },
    findOneAndUpdate: async (conditions: any, update: any, options: any): Promise<any> =>  { },
  };

  before(async () => {
    const testAppModule: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryAttemptService,
        {
          provide: 'DeliveryAttemptModel',
          useValue: deliveryAttemptModel,
        },
      ],
    }).compile();

    deliveryAttemptService = testAppModule.get<DeliveryAttemptService>(DeliveryAttemptService);
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(async () => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('createDeliveryAttempt', () => {
    it('should create and return DeliveryAttempt model', async () => {
      sandbox.stub(deliveryAttemptModel, 'create').callsFake(async (args: any) => {
        expect(args).to.matchPattern({
          notificationId: 'notification-id',
          status: 'new',
        });

        return new DeliveryAttempt(args);
      });

      const result: any = await deliveryAttemptService.createDeliveryAttempt('notification-id');

      const expectedResult: any = {
        _id: _.isString,
        notificationId: 'notification-id',
        status: 'new',
      };

      assert.instanceOf(result, DeliveryAttempt);
      expect(result.toObject()).to.matchPattern(expectedResult);
    });
  });

  describe('updateDeliveryAttempt', () => {
    it('should update and return DeliveryAttempt model', async () => {
      const deliveryAttemptId: string = 'delivery-attempt-id';

      const deliveryAttemptDto: DeliveryAttemptDto = {
        exceptionMessage: 'exception-message',
        notificationId: 'notification-id',
        responseMessage: 'response-message',
        responseStatusCode: 200,
        status: PaymentNotificationStatusesEnum.STATUS_SUCCESS,
      };

      const deliveryAttempt: DeliveryAttemptModel = new DeliveryAttempt({
        _id: deliveryAttemptId,
        ...deliveryAttemptDto,
      });

      sandbox.stub(deliveryAttemptModel, 'findOneAndUpdate').callsFake(
        async (conditions: any, update: any, options: any) => {
          expect(conditions).to.matchPattern({ _id: deliveryAttemptId });
          expect(update).to.matchPattern(deliveryAttemptDto);
          expect(options).to.eql({ new: true });

          return deliveryAttempt;
        },
      );

      const result: any = await deliveryAttemptService.updateDeliveryAttempt(
        deliveryAttemptId,
        deliveryAttemptDto,
      );

      const expectedResult: any = {
        _id: deliveryAttemptId,
        ...deliveryAttemptDto,
      };

      assert.instanceOf(result, DeliveryAttempt);
      expect(result.toObject()).to.matchPattern(expectedResult);
    });
  });
});
