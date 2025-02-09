import 'mocha';
import * as sinon from 'sinon';
import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { chaiExpect } from '../../bootstrap';
import { ErrorNotificationService, SettingsService } from '../../../src/error-notifications/services';
import { ErrorNotificationEventDto, ErrorNotificationAggregateDto } from '../../../src/error-notifications/dto';
import { ErrorNotificationTypesEnum } from '../../../src/error-notifications/enums';
import { SendingByCronUpdateIntervalErrorTypes } from '../../../src/error-notifications/constants';

const expect: Chai.ExpectStatic = chaiExpect;

/* tslint:disable-next-line */
describe('ErrorNotificationService', () => {
  let sandbox: sinon.SinonSandbox;
  let app: INestApplication;
  let errorNotificationService: ErrorNotificationService;
  let settingsService: SettingsService;

  const errorNotificationModel: any = {
    aggregate: async (args: any): Promise<any> => { },
    create: async (args: any): Promise<any> => { },
    findOne: async (args: any): Promise<any> => { },
  };

  before(async () => {
    const testAppModule: TestingModule = await Test.createTestingModule({
      providers: [
        ErrorNotificationService,
        {
          provide: 'SettingsService',
          useValue: {
            getSettingsByParams: async (args: any): Promise<any> => { },
            getSettingsByReminderOption: async (): Promise<any[]> => { return []; },
            getStoredSettingsByBusiness: async (args: any): Promise<any> => { },
          },
        },
        {
          provide: 'ErrorNotificationModel',
          useValue: errorNotificationModel,
        },
        {
          provide: 'Logger',
          useValue: {
            error: async (args: any): Promise<any> => { },
            log: async (args: any): Promise<any> => { },
          },
        },
      ],
    }).compile();

    app = testAppModule.createNestApplication();
    errorNotificationService = testAppModule.get<ErrorNotificationService>(ErrorNotificationService);
    settingsService = testAppModule.get<SettingsService>(SettingsService);
    await app.init();
  });

  beforeEach(async () => {
    sandbox = await sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  describe('createNotificationError', () => {
    it('should create createNotificationError model', async () => {
      const dto: ErrorNotificationEventDto = {
        businessId: 'test-business-id',
        errorDate: new Date(),
        errorDetails: {
          noticeUrl: 'https://test.com/notice-url',
          paymentId: 'test-payment-id',
          statusCode: 500,
        },
        type: ErrorNotificationTypesEnum.paymentNotificationFailed,
      };

      sandbox.stub(errorNotificationModel, 'create').callsFake(async (args: any) => {
        expect(args).to.matchPattern(dto);
      });

      await errorNotificationService.createNotificationError(dto);
    });
  });

  describe('getNotificationErrorsDeliveryReady', () => {
    it('should return delivery ready ErrorNotification models', async () => {
      const dateFrom: Date = new Date('2020-08-09');
      const dateTo: Date = new Date('2020-08-10');

      const expectedResult: ErrorNotificationAggregateDto  = {
        businessId: 'test-business-id',
        errors: [
          {
            businessId: 'test-business-id',
            noticeUrl: 'https://test.com/notice-url',
            paymentId: 'test-payment-id',
            statusCode: 500,
          },
        ] as any[],
        integration: 'cash',
        type: ErrorNotificationTypesEnum.paymentNotificationFailed,
      };

      sandbox.stub(errorNotificationModel, 'aggregate').callsFake(async (args: any) => {
        expect(args.length).to.equal(3);
        expect(args[0]).to.matchPattern({
          '$match': {
            $and: [
              {
                'type': { $in: SendingByCronUpdateIntervalErrorTypes},
              },
              {
                createdAt: {
                  '$gte': dateFrom,
                  '$lte': dateTo,
                },
              },
            ],
          },
        });
        expect(args[1]).to.matchPattern({
          '$group': {
            _id: {
              'businessId': '$businessId',
              'integration': '$integration',
              'type': '$type',
            },
            errors: { '$push': '$$ROOT' },
          },
        });
        expect(args[2]).to.matchPattern({
          '$project': {
            _id: 0,
            businessId: '$_id.businessId',
            integration: '$_id.integration',
            type: '$_id.type',

            errors: 1,
          },
        });

        return expectedResult;
      });

      const result: any = await errorNotificationService.getErrorNotificationDeliveryReadyCronInterval(
        dateFrom,
        dateTo,
      );

      expect(result).to.matchPattern(expectedResult);
    });
  });

  describe('getErrorNotificationDeliveryReady aggregated results by last 24 hours', () => {
    it('should return delivery ready ErrorNotification models', async () => {
      const dateFrom: Date = new Date('2020-08-09');
      const dateTo: Date = new Date('2020-08-10');

      const expectedResult: ErrorNotificationAggregateDto  = {
        businessId: 'test-business-id',
        errors: [
          {
            noticeUrl: 'https://test.com/notice-url',
            paymentId: 'test-payment-id',
            statusCode: 500,
          },
        ] as any[],
        integration: 'cash',
        type: ErrorNotificationTypesEnum.paymentNotificationFailed,
      };

      sandbox.stub(errorNotificationModel, 'aggregate').callsFake(async (args: any) => {
        expect(args.length).to.equal(3);
        expect(args[0]).to.matchPattern({
          '$match': {
            $and: [
              {
                'type': { $in: SendingByCronUpdateIntervalErrorTypes},
              },
              {
                createdAt: {
                  '$gte': dateFrom,
                  '$lte': dateTo,
                },
              },
            ],
          },
        });
        expect(args[1]).to.matchPattern({
          '$group': {
            _id: {
              'businessId': '$businessId',
              'integration': '$integration',
              'type': '$type',
            },
            errors: { '$push': '$$ROOT' },
          },
        });
        expect(args[2]).to.matchPattern({
          '$project': {
            _id: 0,
            businessId: '$_id.businessId',
            integration: '$_id.integration',
            type: '$_id.type',

            errors: 1,
          },
        });

        return expectedResult;
      });

      const result: any = await errorNotificationService.getErrorNotificationDeliveryReadyCronInterval(
        dateFrom,
        dateTo,
      );

      expect(result).to.matchPattern(expectedResult);
    });
  });

});
