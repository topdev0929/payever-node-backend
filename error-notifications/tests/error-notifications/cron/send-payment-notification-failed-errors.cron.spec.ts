import 'mocha';
import * as sinon from 'sinon';
import { Test, TestingModule } from '@nestjs/testing';
import { chaiExpect } from '../../bootstrap';
import {
  ErrorNotificationService,
  EmailSender,
  SettingsService, TransactionsService,
} from '../../../src/error-notifications/services';
import { SendNotificationErrorsCron } from '../../../src/error-notifications/cron';
import { Logger } from '@nestjs/common';
import { ErrorNotificationAggregateDto } from '../../../src/error-notifications/dto';
import { CronUpdateIntervalEnum, ErrorNotificationTypesEnum } from '../../../src/error-notifications/enums';

const expect: Chai.ExpectStatic = chaiExpect;

describe('SendPaymentNotificationFailedErrorsCron', () => {
  let sandbox: sinon.SinonSandbox;
  let logger: Logger;
  let errorNotificationService: ErrorNotificationService;
  let emailSender: EmailSender;
  let cron: SendNotificationErrorsCron;
  let settingsService: SettingsService;
  let transactionsService: TransactionsService;

  before(async () => {
    const testAppModule: TestingModule = await Test.createTestingModule({
      providers: [
        SendNotificationErrorsCron,
        {
          provide: 'ErrorNotificationService',
          useValue: {
            getErrorNotificationDeliveryReadyCronInterval: async (args: any): Promise<void> => { },
          },
        },
        {
          provide: 'EmailSender',
          useValue: {
            sendEmails: async (args: any): Promise<void> => { },
          },
        },
        {
          provide: 'Logger',
          useValue: {
            error: async (args: any): Promise<any> => { },
            log: async (args: any): Promise<any> => { },
          },
        },
        {
          provide: 'SettingsService',
          useValue: {
            getSettingsByParams: async (args: any): Promise<any> => { },
            getSettingsByReminderOption: async (): Promise<any[]> => { return []; },
          },
        },
        {
          provide: 'TransactionsService',
          useValue: {
            getLastTransactions: async (args: any): Promise<any> => { },
          },
        },
      ],
    }).compile();

    logger = testAppModule.get<Logger>(Logger);
    errorNotificationService = testAppModule.get<ErrorNotificationService>(ErrorNotificationService);
    emailSender =
      testAppModule.get<EmailSender>(EmailSender);
    cron = testAppModule.get<SendNotificationErrorsCron>(SendNotificationErrorsCron);
    settingsService = testAppModule.get<SettingsService>(SettingsService);
    transactionsService = testAppModule.get<TransactionsService>(TransactionsService);
  });

  beforeEach(async () => {
    sandbox = await sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  describe('sendPaymentNotificationFailedErrors', () => {
    it('should send payment notification failed errors emails', async () => {
      const failedErrors: ErrorNotificationAggregateDto[] = [
        {
          businessId: 'test-business-id',
          errors: [
            {
              businessId: 'test-business-id',
              errorDate: new Date(),
              errorDetails: {
                noticeUrl: 'https://test.com/notice-url',
                paymentId: 'test-payment-id',
                statusCode: 500,
              },
              type: ErrorNotificationTypesEnum.paymentNotificationFailed,
            },
          ],
          integration: 'cash',
          type: ErrorNotificationTypesEnum.paymentNotificationFailed,
        },
      ];

      sandbox.stub(errorNotificationService, 'getErrorNotificationDeliveryReadyCronInterval').callsFake(
        async (dateFrom: Date, dateTo: Date) => {
          const expectedDateFrom: Date = new Date();
          const expectedDateTo: Date = new Date();
          expectedDateFrom.setUTCDate(expectedDateFrom.getUTCDate() - 1);

          expect(dateFrom.getUTCFullYear()).to.equal(expectedDateFrom.getUTCFullYear());
          expect(dateFrom.getUTCMonth()).to.equal(expectedDateFrom.getUTCMonth());
          expect(dateFrom.getUTCDate()).to.equal(expectedDateFrom.getUTCDate());

          expect(dateTo.getUTCFullYear()).to.equal(expectedDateTo.getUTCFullYear());
          expect(dateTo.getUTCMonth()).to.equal(expectedDateTo.getUTCMonth());
          expect(dateTo.getUTCDate()).to.equal(expectedDateTo.getUTCDate());

          return failedErrors;
        },
      );

      sandbox.stub(emailSender, 'sendEmails').callsFake(
        async (data: ErrorNotificationAggregateDto) => {
          expect(data).to.matchPattern(failedErrors[0]);
        },
      );

      await cron.sendNotificationErrorsByCronInterval(CronUpdateIntervalEnum.every24Hours);
    });
  });
});
