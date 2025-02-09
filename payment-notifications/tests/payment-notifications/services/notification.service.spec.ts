import 'mocha';
import * as sinon from 'sinon';
import * as mongoose from 'mongoose';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { chaiAssert, chaiExpect, matchLodash } from '../../bootstrap';
import { ApiCallModel, DeliveryAttemptModel, NotificationModel } from '../../../src/payment-notifications/models';
import {
  ApiCallSchema,
  ApiCallSchemaName,
  DeliveryAttemptSchema,
  DeliveryAttemptSchemaName,
  NotificationSchema,
  NotificationSchemaName,
} from '../../../src/payment-notifications/schemas';
import { ApiCallService, NotificationService } from '../../../src/payment-notifications/services';
import { PaymentEventTypesEnum, PaymentNotificationStatusesEnum } from '../../../src/payment-notifications/enums';
import { PaymentStatusesEnum, TransactionEventPaymentDto } from '@pe/payments-sdk';
import { Mutex } from '@pe/nest-kit';
import { PaymentEventDto } from '../../../src/payment-notifications';

const expect: Chai.ExpectStatic = chaiExpect;
const assert: Chai.Assert = chaiAssert;
const _: any = matchLodash;

/* tslint:disable-next-line */
describe('NotificationService', () => {
  let sandbox: sinon.SinonSandbox;
  let apiCallService: ApiCallService;
  let notificationService: NotificationService;
  let mutex: Mutex;
  let logger: Logger;

  const Notification: any = mongoose.model(
    NotificationSchemaName,
    NotificationSchema,
  );

  const ApiCall: mongoose.Model<ApiCallModel> = mongoose.model(
    ApiCallSchemaName,
    ApiCallSchema,
  );

  const DeliveryAttempt: any = mongoose.model(
    DeliveryAttemptSchemaName,
    DeliveryAttemptSchema,
  );

  const notificationModel: any = {
    create: async (args: any): Promise<any> => { },
    find: async (conditions: any): Promise<any> => { },
    findOne: async (conditions: any): Promise<any> => { },
    findOneAndUpdate: async (conditions: any, update: any): Promise<any> => { },
  };

  before(async () => {
    const testAppModule: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: 'NotificationModel',
          useValue: notificationModel,
        },
        {
          provide: 'ApiCallService',
          useValue: {
            findByApiCallId: async (id?: string): Promise<any> => { },
            modifyCallbackUrl: async (url?: string, apiCallId?: string, paymentId?: string): Promise<any> => { },
          },
        },
        {
          provide: 'Mutex',
          useValue: {
            lock: async (args: any): Promise<any> => { },
          },
        },
        {
          provide: 'Logger',
          useValue: {
            log: async (args: any): Promise<any> => { },
          },
        },
      ],
    }).compile();

    apiCallService = testAppModule.get<ApiCallService>(ApiCallService);
    notificationService = testAppModule.get<NotificationService>(NotificationService);
    mutex = testAppModule.get<Mutex>(Mutex);
    logger = testAppModule.get<Logger>(Logger);
  });

  beforeEach(async () => {
    sandbox = await sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  describe('getNotification', () => {
    it('should return Notification model', async () => {
      const notification: NotificationModel = new Notification({
        _id: '999999',
      });

      sandbox.stub(notification, 'populate').callsFake((args: any) => {
        return notification;
      });
      sandbox.stub(notification, 'execPopulate').callsFake(async () => {
        return notification;
      });
      sandbox.stub(notificationModel, 'findOne').callsFake(
        async (conditions: any) => {
          expect(conditions).to.matchPattern({ _id: notification._id });

          return notification;
        },
      );

      const expectedResult: any = {
        _id: '999999',
        deliveryAt: _.isDate,
        deliveryAttempts: [],
        retriesNumber: 0,
      };

      const result: any = await notificationService.getNotification('999999');

      assert.instanceOf(result, Notification);
      expect(result.toObject()).to.matchPattern(expectedResult);
    });
  });

  describe('createPaymentNotification', () => {
    it('shouldn\'t create Notification model when payment type is not allowed', async () => {
      const paymentDto: PaymentEventDto = {
        payment: {
          payment_type: 'stripe',
        } as TransactionEventPaymentDto,
      };

      await notificationService.createPaymentNotificationFromPaymentEvent(
        paymentDto,
        PaymentEventTypesEnum.TYPE_PAYMENT_CREATED,
      );
    });

    it('shouldn\'t create Notification model when ApiCall model not found', async () => {
      const paymentDto: PaymentEventDto = {
        payment: {
          /* tslint:disable-next-line */
          api_call_id: 'api-call-id',
          payment_type: 'instant_payment',
        } as TransactionEventPaymentDto,
      };

      sandbox.stub(apiCallService, 'findByApiCallId')
        .callsFake(async (id?: string) => {
          assert.equal(id, 'api-call-id');

          return null;
        });

      await notificationService.createPaymentNotificationFromPaymentEvent(
        paymentDto,
        PaymentEventTypesEnum.TYPE_PAYMENT_CREATED,
      );
    });

    it('shouldn\'t create Notification model when notice url is undefined', async () => {
      const paymentDto: PaymentEventDto = {
        payment: {
          api_call_id: 'api-call-id',
          payment_type: 'instant_payment',
        } as TransactionEventPaymentDto,
      };

      sandbox.stub(apiCallService, 'findByApiCallId')
        .callsFake(async (id?: string) => {
          assert.equal(id, 'api-call-id');

          return new ApiCall({ });
        });

      await notificationService.createPaymentNotificationFromPaymentEvent(
        paymentDto,
        PaymentEventTypesEnum.TYPE_PAYMENT_CREATED,
      );
    });

    it('should create Notification model', async () => {
      const paymentDto: PaymentEventDto = {
        payment: {
          id: 'payment-id',
          /* tslint:disable-next-line */
          amount: 200,
          api_call_id: 'api-call-id',
          business: {
            company_name: 'Test',
            uuid: '12345',
          },
          channel: 'channel-set',
          currency: 'EUR',
          customer_email: 'customer-email',
          customer_name: 'customer-name',
          delivery_fee: 0,
          down_payment: 0,
          payment_details: {},
          payment_fee: 0,
          payment_type: 'instant_payment',
          reference: 'reference',
          specific_status: 'specific-status',
          status: PaymentStatusesEnum.STATUS_ACCEPTED,
          total: 200,
        } as TransactionEventPaymentDto,
      };

      sandbox.stub(apiCallService, 'findByApiCallId')
        .callsFake(async (id?: string) => {
          assert.equal(id, 'api-call-id');

          return new ApiCall({
            noticeUrl: 'notice-url',
          });
        });

      await notificationService.createPaymentNotificationFromPaymentEvent(
        paymentDto,
        PaymentEventTypesEnum.TYPE_PAYMENT_CREATED,
      );
    });

    describe('getNotificationsDeliveryReady', () => {
      it('should return Notifications array', async () => {
        const startDate: Date = new Date();
        startDate.setUTCDate(startDate.getUTCDate() - 30);
        const endDate: Date = new Date();

        const notification: NotificationModel = new Notification({
          _id: '111111',
        });

        sandbox.stub(notificationModel, 'find').callsFake(
          async (conditions: any) => {
            expect(conditions).to.matchPattern({
              deliveryAt: { $gte: startDate, $lte: endDate },
              retriesNumber: { $lt: 2 },
              status: PaymentNotificationStatusesEnum.STATUS_NEW,
            });

            return [notification];
          },
        );

        const result: any = await notificationService.getNotificationsDeliveryReady(
          startDate,
          endDate,
          PaymentNotificationStatusesEnum.STATUS_NEW,
          2,
        );

        const expectedResult: any = {
          _id: '111111',
          deliveryAt: _.isDate,
          deliveryAttempts: [],
          retriesNumber: 0,
        };

        assert.isArray(result);
        assert.lengthOf(result, 1);
        assert.instanceOf(result[0], Notification);
        expect(result[0].toObject()).to.matchPattern(expectedResult);
      });
    });

    describe('getNotificationsDeliveryReady', () => {
      it('should add DeliveryAttempt model to Notification model', async () => {
        const notification: NotificationModel = new Notification({
          _id: '111111',
          deliveryAttempts: [
            '222222',
          ],
        });

        const deliveryAttempt: DeliveryAttemptModel = new DeliveryAttempt({
          _id: '222222',
          status: 'new',
        });

        sandbox.stub(notificationModel, 'findOneAndUpdate').callsFake(
          async (conditions: any, update: any) => {
            expect(conditions).to.matchPattern({ _id: '111111' });
            expect(update).to.matchPattern({
              $inc: { retriesNumber: 1 },
              $push: { deliveryAttempts: '222222' },
              $set: { status: 'new' },
            });
          },
        );

        await notificationService.addDeliveryAttempt(
          notification,
          deliveryAttempt,
        );
      });
    });
  });
});
