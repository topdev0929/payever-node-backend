import 'mocha';
import * as sinon from 'sinon';
import * as mongoose from 'mongoose';
import { HttpService, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { chaiExpect } from '../../bootstrap';
import { DeliveryAttemptModel, NotificationModel } from '../../../src/payment-notifications/models';
import {
  DeliveryAttemptSchema,
  DeliveryAttemptSchemaName,
  NotificationSchema,
  NotificationSchemaName,
} from '../../../src/payment-notifications/schemas';
import {
  DeliveryAttemptService,
  NotificationSender,
  NotificationService,
  NotificationSignatureGenerator,
} from '../../../src/payment-notifications/services';
import { AxiosError, AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash';

const expect: Chai.ExpectStatic = chaiExpect;

/* tslint:disable-next-line */
describe('NotificationSender', () => {
  let sandbox: sinon.SinonSandbox;
  let notificationSender: NotificationSender;
  let notificationService: NotificationService;
  let deliveryAttemptService: DeliveryAttemptService;
  let signatureGenerator: NotificationSignatureGenerator;
  let httpService: HttpService;
  let logger: Logger;

  const Notification: any = mongoose.model(
    NotificationSchemaName,
    NotificationSchema,
  );

  const DeliveryAttempt: any = mongoose.model(
    DeliveryAttemptSchemaName,
    DeliveryAttemptSchema,
  );

  before(async () => {
    const testAppModule: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationSender,
        {
          provide: 'NotificationService',
          useValue: {
            addDeliveryAttempt: async (args: any): Promise<any> => { },
          },
        },
        {
          provide: 'NotificationSignatureGenerator',
          useValue: {
            generateNotificationSignature: async (args: any): Promise<any> => { },
          },
        },
        {
          provide: 'HttpService',
          useValue: {
            post: async (args: any): Promise<any> => { },
          },
        },
        {
          provide: 'DeliveryAttemptService',
          useValue: {
            createDeliveryAttempt: async (args: any): Promise<any> => { },
            updateDeliveryAttempt: async (args: any): Promise<any> => { },
          },
        },
        {
          provide: 'Logger',
          useValue: {
            warn: async (args: any): Promise<any> => { },
            log: async (args: any): Promise<any> => { },
          },
        },
        {
          provide: 'EventDispatcher',
          useValue: {
            dispatch: async (args: any): Promise<any> => { },
          },
        },
      ],
    }).compile();

    notificationSender = testAppModule.get<NotificationSender>(NotificationSender);
    notificationService = testAppModule.get<NotificationService>(NotificationService);
    signatureGenerator = testAppModule.get<NotificationSignatureGenerator>(NotificationSignatureGenerator);
    deliveryAttemptService = testAppModule.get<DeliveryAttemptService>(DeliveryAttemptService);
    httpService = testAppModule.get<HttpService>(HttpService);
    logger = testAppModule.get<Logger>(Logger);
  });

  beforeEach(async () => {
    sandbox = await sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  describe('sendPaymentNotification', () => {
    it('should send payment notification to merchant with success response', async () => {
      const notification: NotificationModel = new Notification({
        _id: '999999',
        apiCallId: 'api-call-id',
        deliveryAt: new Date(),
        deliveryAttempts: [],
        message: '{ "data": "notification-data" }',
        paymentId: 'payment-id',
        retriesNumber: 0,
        status: 'new',
        url: 'https://notice.url',
      });

      const deliveryAttempt: DeliveryAttemptModel = new DeliveryAttempt({
        _id: '111111',
        notificationId: '999999',
        status: 'new',
      });

      const httpResult: AxiosResponse = {
        config: { },
        data: { },
        headers: { },
        status: 200,
        statusText: 'OK',
      };

      sandbox.stub(deliveryAttemptService, 'createDeliveryAttempt').callsFake(async (id: any) => {
        expect(id).to.eq('999999');

        return deliveryAttempt;
      });

      sandbox.stub(signatureGenerator, 'generateNotificationSignature').callsFake(async (model: any) => {
        expect(model.id).to.eq('999999');

        return 'signature';
      });

      sandbox.stub(httpService, 'post').callsFake((url: any, message: any, config: any) => {
        expect(url).to.eq('https://notice.url');
        expect(message).to.eq('{ "data": "notification-data" }');
        expect(config).matchPattern({
          headers: {
            'Content-Type': 'application/json',
            'X-PAYEVER-SIGNATURE': 'signature',
          },
          httpAgent: Object,
          httpsAgent: Object,
          maxRedirects: 3,
          timeout: 10000,
        });

        return of(httpResult);
      });

      sandbox.stub(deliveryAttemptService, 'updateDeliveryAttempt').callsFake(async (id: any, dto: any) => {
        expect(id).to.eq('111111');
        expect(dto.notificationId).to.eq('999999');
        expect(dto.responseStatusCode).to.eq(200);
        expect(dto.status).to.eq('success');

        return deliveryAttempt;
      });

      sandbox.stub(notificationService, 'addDeliveryAttempt').callsFake(async (
        notificationModel: any,
        deliveryAttemptModel: any,
        ) => {
          expect(notificationModel).to.eq(notification);
          expect(deliveryAttemptModel).to.eq(deliveryAttempt);

          return notificationModel;
      });

      const result: any = await notificationSender.sendPaymentNotification(notification);
    });

    it('should send payment notification to merchant with error response', async () => {
      const notification: NotificationModel = new Notification({
        _id: '999999',
        apiCallId: 'api-call-id',
        deliveryAt: new Date(),
        deliveryAttempts: [],
        message: '{ "data": "notification-data" }',
        paymentId: 'payment-id',
        retriesNumber: 0,
        status: 'new',
        url: 'https://notice.url',
      });

      const deliveryAttempt: DeliveryAttemptModel = new DeliveryAttempt({
        _id: '111111',
        notificationId: '999999',
        status: 'new',
      });

      const httpResult: AxiosResponse = {
        config: { },
        data: { error: 'Error occurred'},
        headers: { },
        status: 400,
        statusText: 'Bad Request',
      };

      const httpError: AxiosError = {
        config: { },
        isAxiosError: false,
        message: 'Error',
        name: 'Error',
        response: httpResult,
        toJSON: () => { return this; },
      };

      /* tslint:disable-next-line */
      sandbox.stub(deliveryAttemptService, 'createDeliveryAttempt').callsFake(async (id: any) => {
        expect(id).to.eq('999999');

        return deliveryAttempt;
      });

      sandbox.stub(httpService, 'post').callsFake((url: any, message: any, config: any) => {
        expect(url).to.eq('https://notice.url');
        expect(message).to.eq('{ "data": "notification-data" }');

        return throwError(httpError);
      });

      sandbox.stub(deliveryAttemptService, 'updateDeliveryAttempt').callsFake(async (id: any, dto: any) => {
        expect(id).to.eq('111111');
        expect(dto.notificationId).to.eq('999999');
        expect(dto.responseStatusCode).to.eq(400);
        expect(dto.status).to.eq('failed');
        expect(dto.exceptionMessage).to.eq('Bad Request');
        expect(dto.responseMessage).to.eq('{"error":"Error occurred"}');

        return deliveryAttempt;
      });

      sandbox.stub(notificationService, 'addDeliveryAttempt').callsFake(async (
        notificationModel: any,
        deliveryAttemptModel: any,
        /* tslint:disable-next-line */
      ) => {
        expect(notificationModel).to.eq(notification);
        expect(deliveryAttemptModel).to.eq(deliveryAttempt);

        return notificationModel;
      });

      const result: any = await notificationSender.sendPaymentNotification(notification);
    });
  });
});
