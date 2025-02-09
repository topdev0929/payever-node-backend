import 'mocha';
import * as sinon from 'sinon';
import { Test, TestingModule } from '@nestjs/testing';
import { chaiExpect } from '../../bootstrap';
import { EmailSender, RabbitMqService, EmailTransformerCollector } from '../../../src/error-notifications/services';
import { ErrorNotificationAggregateDto } from '../../../src/error-notifications/dto';
import { ErrorNotificationTypesEnum } from '../../../src/error-notifications';

const expect: Chai.ExpectStatic = chaiExpect;

describe('EmailSender', () => {
  let sandbox: sinon.SinonSandbox;
  let rabbitMqService: RabbitMqService;
  let emailSender: EmailSender;
  let emailTransformerCollector: EmailTransformerCollector;

  before(async () => {
    const testAppModule: TestingModule = await Test.createTestingModule({
      providers: [
        EmailSender,
        {
          provide: 'RabbitMqService',
          useValue: {
            sendEvent: async (args: any): Promise<void> => { },
          },
        },
        EmailTransformerCollector,
      ],
    }).compile();

    rabbitMqService = testAppModule.get<RabbitMqService>(RabbitMqService);
    emailSender = testAppModule.get<EmailSender>(EmailSender);
    emailTransformerCollector = testAppModule.get<EmailTransformerCollector>(EmailTransformerCollector);
  });

  beforeEach(async () => {
    sandbox = await sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  describe('sendNotificationErrorEmail', () => {
    it('should send payment notification failed email event', async () => {
      const errorNotificationDto: ErrorNotificationAggregateDto  = {
        businessId: 'test-business-id',
        integration: 'cash',
        type: ErrorNotificationTypesEnum.paymentNotificationFailed,

        errors: [
          {
            noticeUrl: 'https://test.com/notice-url',
            paymentId: 'test-payment-id',
            statusCode: 500,
          },
        ] as any[],
      };

      sandbox.stub(rabbitMqService, 'sendEvent').callsFake(
        async (exchange: string, eventName: string, payload: { }) => {
          expect(exchange).to.equal('async_events');
          expect(eventName).to.equal('payever.event.business.email');
          expect(payload).to.matchPattern({
            businessId: 'test-business-id',
            locale: 'en',
            templateName: 'error_notifications.payment_notification.failed',
            variables: {
              errors: [
                {
                  noticeUrl: 'https://test.com/notice-url',
                  paymentId: 'test-payment-id',
                  statusCode: 500,
                },
              ],
            },
          });
        },
      );

      await emailSender.sendEmails(errorNotificationDto);
    });
  });
});
