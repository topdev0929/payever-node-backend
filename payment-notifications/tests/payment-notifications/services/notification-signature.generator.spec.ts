import 'mocha';
import * as sinon from 'sinon';
import * as mongoose from 'mongoose';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { chaiExpect } from '../../bootstrap';
import { ApiCallModel, NotificationModel } from '../../../src/payment-notifications/models';
import {
  ApiCallSchema,
  ApiCallSchemaName,
  NotificationSchema,
  NotificationSchemaName,
} from '../../../src/payment-notifications/schemas';
import {
  ApiCallService,
  NotificationSignatureGenerator,
  OAuthService,
} from '../../../src/payment-notifications/services';

const expect: Chai.ExpectStatic = chaiExpect;

/* tslint:disable-next-line */
describe('NotificationSignatureGenerator', () => {
  let sandbox: sinon.SinonSandbox;
  let apiCallService: ApiCallService;
  let oAuthService: OAuthService;
  let logger: Logger;
  let notificationSignatureGenerator: NotificationSignatureGenerator;

  const ApiCall: mongoose.Model<ApiCallModel> = mongoose.model(
    ApiCallSchemaName,
    ApiCallSchema,
  );

  const Notification: any = mongoose.model(
    NotificationSchemaName,
    NotificationSchema,
  );

  before(async () => {
    const testAppModule: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationSignatureGenerator,
        {
          provide: 'ApiCallService',
          useValue: {
            findByApiCallId: async (args: any): Promise<any> => { },
          },
        },
        {
          provide: 'OAuthService',
          useValue: {
            getOAuthClientSecret: async (args: any): Promise<any> => { },
          },
        },
        {
          provide: 'Logger',
          useValue: {
            warn: async (args: any): Promise<any> => { },
            log: async (args: any): Promise<any> => { },
          },
        },
      ],
    }).compile();

    oAuthService = testAppModule.get<OAuthService>(OAuthService);
    apiCallService = testAppModule.get<ApiCallService>(ApiCallService);
    notificationSignatureGenerator = testAppModule.get<NotificationSignatureGenerator>(NotificationSignatureGenerator);
    logger = testAppModule.get<Logger>(Logger);
  });

  beforeEach(async () => {
    sandbox = await sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  describe('generateNotificationSignature', () => {
    it('should generate and return notification signature', async () => {
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

      sandbox.stub(apiCallService, 'findByApiCallId').callsFake(async (id?: string) => {
        expect(id).to.eq('api-call-id');

        return new ApiCall({
          _id: 'api-call-id',
          businessId: 'business-id',
          clientId: 'oauth-client-id',
          paymentId: 'payment-id',
          /* tslint:disable-next-line */
          cancelUrl: 'http://cancel-url.com/--CALL-ID--/--PAYMENT-ID--',
          failureUrl: 'http://failure-url.com/--CALL-ID--/--PAYMENT-ID--',
          noticeUrl: 'http://notice-url.com/--CALL-ID--/--PAYMENT-ID--',
          pendingUrl: 'http://pending-url.com/--CALL-ID--/--PAYMENT-ID--',
          successUrl: 'http://success-url.com/--CALL-ID--/--PAYMENT-ID--',
        });
      });

      sandbox.stub(oAuthService, 'getOAuthClientSecret').callsFake(async (clientId: string, businessId: string) => {
        expect(clientId).to.eq('oauth-client-id');
        expect(businessId).to.eq('business-id');

        return {
          secret: 'oauth-client-secret',
        };
      });

      const result: any = await notificationSignatureGenerator.generateNotificationSignature(notification);

      expect(result).to.eq('3435926de39e4a6b6e50c6e869c8ec58debb3feaceded4be8e8e0f0fe85987a9');
    });

    it('should return null on empty secret', async () => {
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

      sandbox.stub(apiCallService, 'findByApiCallId').callsFake(async (id?: string) => {
        expect(id).to.eq('api-call-id');

        return new ApiCall({
          _id: 'api-call-id',
          businessId: 'business-id',
          clientId: 'oauth-client-id',
          paymentId: 'payment-id',
          /* tslint:disable-next-line */
          cancelUrl: 'http://cancel-url.com/--CALL-ID--/--PAYMENT-ID--',
          failureUrl: 'http://failure-url.com/--CALL-ID--/--PAYMENT-ID--',
          noticeUrl: 'http://notice-url.com/--CALL-ID--/--PAYMENT-ID--',
          pendingUrl: 'http://pending-url.com/--CALL-ID--/--PAYMENT-ID--',
          successUrl: 'http://success-url.com/--CALL-ID--/--PAYMENT-ID--',
        });
      });

      sandbox.stub(oAuthService, 'getOAuthClientSecret').callsFake(async (clientId: string, businessId: string) => {
        expect(clientId).to.eq('oauth-client-id');
        expect(businessId).to.eq('business-id');

        return null;
      });

      const result: any = await notificationSignatureGenerator.generateNotificationSignature(notification);

      expect(result).to.eq(null);
    });
  });
});
