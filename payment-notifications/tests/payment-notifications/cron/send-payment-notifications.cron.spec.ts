import 'mocha';
import * as sinon from 'sinon';
import * as mongoose from 'mongoose';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { chaiExpect } from '../../bootstrap';
import { NotificationModel } from '../../../src/payment-notifications/models';
import { NotificationSchema, NotificationSchemaName, } from '../../../src/payment-notifications/schemas';
import { NotificationService, RabbitMqService } from '../../../src/payment-notifications/services';
import { SendRegularPaymentsNotificationsCron } from '../../../src/payment-notifications/cron';
import { PaymentNotificationStatusesEnum } from '../../../src/payment-notifications/enums';

const expect: Chai.ExpectStatic = chaiExpect;

/* tslint:disable-next-line */
describe('SendPaymentsNotificationsCron', () => {
  let sandbox: sinon.SinonSandbox;
  let sendPaymentNotificationsCron: SendRegularPaymentsNotificationsCron;
  let notificationService: NotificationService;
  let logger: Logger;
  let rabbitMqService: RabbitMqService;

  const Notification: any = mongoose.model(
    NotificationSchemaName,
    NotificationSchema,
  );

  before(async () => {
    const testAppModule: TestingModule = await Test.createTestingModule({
      providers: [
        SendRegularPaymentsNotificationsCron,
        {
          provide: 'NotificationService',
          useValue: {
            getNotificationsDeliveryReady: async (args: any, attempts: any): Promise<any> => { },
            markNotificationAsProcessing: async (args: any, attempts: any): Promise<any> => { },
          },
        },
        {
          provide: 'RabbitMqService',
          useValue: {
            sendEvent: async (exchange: any, eventName: any, payload: any): Promise<any> => { },
          },
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

    sendPaymentNotificationsCron =
    testAppModule.get<SendRegularPaymentsNotificationsCron>(SendRegularPaymentsNotificationsCron);
    notificationService = testAppModule.get<NotificationService>(NotificationService);
    rabbitMqService = testAppModule.get<RabbitMqService>(RabbitMqService);
    logger = testAppModule.get<Logger>(Logger);
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(async () => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('sendPaymentsNotifications', () => {
    it('should send payment notifications to rabbitmq queue', async () => {
      const notification1: NotificationModel = new Notification({
        _id: '999999',
        paymentId: '111111',
      });

      const notification2: NotificationModel = new Notification({
        _id: '888888',
        paymentId: '111111',
      });

      sandbox.stub(notificationService, 'getNotificationsDeliveryReady').callsFake(async (date: any, attempts: any) => {
        return [notification1, notification2];
      });

      sandbox.stub(rabbitMqService, 'sendEvent').callsFake(async (exchange: any, eventName: any, payload: any) => {
        expect(exchange).to.eq('payment_notifications_send');
        expect(eventName).to.eq('1');
        expect(payload).to.matchPattern({ notificationId: '999999'});
      });

      await sendPaymentNotificationsCron.sendPaymentsNotifications(PaymentNotificationStatusesEnum.STATUS_NEW);
    });
  });
});
