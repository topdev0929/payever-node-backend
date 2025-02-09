import 'mocha';
import { chaiExpect } from '../../bootstrap';
import {
  PaymentNotificationFailedTransformer,
} from '../../../src/error-notifications/services/email-transformers/transformers';
import {
  ErrorNotificationAggregateDto,
  ErrorNotificationEmailDto,
} from '../../../src/error-notifications/dto';
import { ErrorNotificationTypesEnum } from '../../../src/error-notifications';
import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { ErrorNotificationInterface } from '../../../src/error-notifications/interfaces';

const expect: Chai.ExpectStatic = chaiExpect;

describe('EmailDtoTransformer', () => {
  let sandbox: sinon.SinonSandbox;
  let paymentNotificationFailedTransformer: PaymentNotificationFailedTransformer;

  before(async () => {
    const testAppModule: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentNotificationFailedTransformer,
      ],
    }).compile();

    paymentNotificationFailedTransformer =
      testAppModule.get<PaymentNotificationFailedTransformer>(PaymentNotificationFailedTransformer);
  });

  beforeEach(async () => {
    sandbox = await sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  describe('PaymentNotificationFailedTransformer', () => {
    it('should return email dto', async () => {
      const dto: ErrorNotificationAggregateDto  = {
        businessId: 'test-business-id',
        type: ErrorNotificationTypesEnum.paymentNotificationFailed,

        errors: [
          {
            businessId: 'test-business-id',
            errorDetails: {
              noticeUrl: 'https://test.com/notice-url',
              paymentId: 'test-payment-id',
              statusCode: 500,
            },
            integration: 'cash',
            type: ErrorNotificationTypesEnum.paymentNotificationFailed,
          },
        ] as ErrorNotificationInterface[],
      };

      const expectedResult: ErrorNotificationEmailDto = {
        businessId: 'test-business-id',
        locale: 'en',
        templateName: 'error_notifications.payment_notification.failed',
        variables: {
          errors: [
            {
              noticeUrl: 'https://test.com/notice-url',
              paymentId: 'test-payment-id',
              statusCode: 500,
            } as any,
          ],
        },
      };

      const result: any = await paymentNotificationFailedTransformer.notificationErrorToEmailDto(dto);

      expect(result).to.matchPattern(expectedResult);
    });
  });
});
