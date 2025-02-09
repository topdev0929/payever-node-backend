import 'mocha';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';
import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { RabbitMqEnum } from '../../../../src/environments';
import { VideoGeneratorMessagesProducer } from '../../../../src/studio/producers';

chai.use(sinonChai);
const expect = chai.expect;

describe('VideoGeneratorMessagesProducer ', () => {
  let sandbox: sinon.SinonSandbox;
  let videoGeneratorMessagesProducer: VideoGeneratorMessagesProducer;
  let rabbitMqClient: RabbitMqClient;

  const business: any = {
    id: uuid.v4(),
  } as any;

  before(async () => {
    const module = await Test.createTestingModule({
      controllers: [VideoGeneratorMessagesProducer],
      providers: [
        {
          provide: RabbitMqClient,
          useValue: {
            send: () => { },
          },
        },
        {
          provide: Logger,
          useValue: {
            log: () => { },
          },
        },
      ],
    }).compile();

    rabbitMqClient = module.get<RabbitMqClient>(RabbitMqClient);
    videoGeneratorMessagesProducer = module.get<VideoGeneratorMessagesProducer>(VideoGeneratorMessagesProducer);
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    sandbox.stub(rabbitMqClient, 'send').resolves();
  });

  afterEach(async () => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('generateVideoFinished method', () => {
    it('should send GenerateVideoFinished', async () => {
      const eventName: RabbitMqEnum = RabbitMqEnum.GenerateVideoFinished;

      const payload: any = {
        businessId: undefined,
        video: '',
      };

      await videoGeneratorMessagesProducer.generateVideoFinished('');

      expect(rabbitMqClient.send).to.have.been.calledWithMatch(
        {
          channel: eventName,
          exchange: 'async_events',
        },
        {
          name: eventName,
          payload: payload,
        },
      );
    });

    it('should send GenerateVideoFinished with business id', async () => {
      const eventName: RabbitMqEnum = RabbitMqEnum.GenerateVideoFinished;

      const payload: any = {
        businessId: business.id,
        video: '',
      };

      await videoGeneratorMessagesProducer.generateVideoFinished('', business.id);

      expect(rabbitMqClient.send).to.have.been.calledWithMatch(
        {
          channel: eventName,
          exchange: 'async_events',
        },
        {
          name: eventName,
          payload: payload,
        },
      );
    });
  });
});
