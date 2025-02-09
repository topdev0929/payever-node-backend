import 'mocha';
import * as sinon from 'sinon';
import { Test, TestingModule } from '@nestjs/testing';
import { chaiExpect } from '../../bootstrap';
import { RabbitMqService } from '../../../src/error-notifications/services';
import { RabbitMqClient } from '@pe/nest-kit';
import { MessageBusEventsEnum, MessageBusExchangesEnum } from '../../../src/error-notifications/enums';

const expect: Chai.ExpectStatic = chaiExpect;

describe('RabbitMqService', () => {
  let sandbox: sinon.SinonSandbox;
  let rabbitMqClient: RabbitMqClient;
  let rabbitMqService: RabbitMqService;

  before(async () => {
    const testAppModule: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitMqService,
        {
          provide: 'RabbitMqClient',
          useValue: {
            send: async (args: any): Promise<void> => { },
          },
        },
      ],
    }).compile();

    rabbitMqService = testAppModule.get<RabbitMqService>(RabbitMqService);
    rabbitMqClient = testAppModule.get<RabbitMqClient>(RabbitMqClient);
  });

  beforeEach(async () => {
    sandbox = await sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });
  describe('sendEvent', () => {
    it('should send event', async () => {
      const payload: { } = {
        data: 'test',
      };

      sandbox.stub(rabbitMqClient, 'send').callsFake(
        async (pattern: { channel: string; exchange?: string; }, data: any) => {
          expect(pattern).to.matchPattern({
            channel: 'payever.event.business.email',
            exchange: 'async_events',
          });
          expect(data).to.matchPattern({
            name: 'payever.event.business.email',
            payload,
          });
        },
      );

      await rabbitMqService.sendEvent(
        MessageBusExchangesEnum.asyncEvents,
        MessageBusEventsEnum.businessEmail,
        payload,
      );
    });
  });
});
