import 'mocha';
import * as sinon from 'sinon';
import { Test, TestingModule } from '@nestjs/testing'
import { chaiExpect } from '../../bootstrap';
import { RabbitMqService } from '../../../src/payment-notifications/services';
import {
  MessageBusExchangesEnum,
  MessageBusRoutingKeys
} from '../../../src/payment-notifications/enums';
import { RabbitMqClient, RabbitMqConnection } from '@pe/nest-kit';

const expect: Chai.ExpectStatic = chaiExpect;

describe('RabbitMqService', () => {
  let sandbox: sinon.SinonSandbox;
  let rabbitMqClient: RabbitMqClient;
  let rabbitConnection: RabbitMqConnection;
  let rabbitMqService: RabbitMqService;

    before(async () => {
      const testAppModule: TestingModule = await Test.createTestingModule({
        providers: [
          RabbitMqService,
          {
            provide: 'RabbitMqClient',
            useValue: {
              send: async (pattern: { channel: string; exchange?: string; }, data: any): Promise<any> => {},
            },
          },
          {
            provide: 'RabbitMqConnection',
            useValue: {
              closeChannel: async ( queue: string): Promise<void> => {},
            },
          },
        ],
      }).compile();

      rabbitMqClient = testAppModule.get<RabbitMqClient>(RabbitMqClient);
      rabbitConnection = testAppModule.get<RabbitMqConnection>(RabbitMqConnection);
      rabbitMqService = testAppModule.get<RabbitMqService>(RabbitMqService);
  });

  beforeEach(async () => {
    sandbox = await sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  describe('sendEvent', () => {
    it('should send event message', async () => {
      sandbox.stub(rabbitMqClient, 'send')
        .callsFake(async (pattern: {}, data: {}) => {
          expect(pattern).to.matchPattern({
            channel: '1',
            exchange: 'payment_notifications_send',
          });
          expect(data).to.matchPattern({
            name: '1',
            payload: {
              notificationId: 'notification-id',
            },
          });
        });

      await rabbitMqService.sendEvent(
        MessageBusExchangesEnum.paymentNotificationsSend,
        MessageBusRoutingKeys.paymentNotificationsRoutingKey1,
        {
          notificationId: 'notification-id',
        },
      );
    });
  });
});
