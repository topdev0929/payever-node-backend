import 'mocha';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';
import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { RabbitMqEnum } from '../../../../src/environments';
import { StudioMediasUploadedMessagesProducer } from '../../../../src/studio/producers';
import { BlobInterface } from '../../../../src/studio/interfaces/blob.interface';

chai.use(sinonChai);
const expect = chai.expect;

describe('StudioMediasUploadedMessagesProducer ', () => {
  let sandbox: sinon.SinonSandbox;
  let studioMediasUploadedMessagesProducer: StudioMediasUploadedMessagesProducer;
  let rabbitMqClient: RabbitMqClient;

  const business: any = {
    id: uuid.v4(),
  } as any;

  before(async () => {
    const module = await Test.createTestingModule({
      controllers: [StudioMediasUploadedMessagesProducer],
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
    studioMediasUploadedMessagesProducer = module.get<StudioMediasUploadedMessagesProducer>(StudioMediasUploadedMessagesProducer);
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    sandbox.stub(rabbitMqClient, 'send').resolves();
  });

  afterEach(async () => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('userMediasUploaded method', () => {
    it('should send UserMediasUploaded', async () => {
      const eventName: RabbitMqEnum = RabbitMqEnum.UserMediasUploaded;

      const media: BlobInterface = {
      } as any;

      const payload: any = {
        businessId: business.id,
        medias: [media],
      };

      await studioMediasUploadedMessagesProducer.userMediasUploaded([media], business.id);

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

  describe('userMediasUploadedError method', () => {
    it('should send UserMediasUploadedError', async () => {
      const eventName: RabbitMqEnum = RabbitMqEnum.UserMediasUploadedError;

      const media: string = 'test';

      const payload: any = {
        businessId: business.id,
        medias: [media],
      };

      await studioMediasUploadedMessagesProducer.userMediasUploadedError([media], business.id);

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

  describe('subscriptionMediasUploaded method', () => {
    it('should send SubscriptionMediasUploaded', async () => {
      const eventName: RabbitMqEnum = RabbitMqEnum.SubscriptionMediasUploaded;

      const media: BlobInterface = {
      } as any

      const payload: any = {
        medias: [media],
      };

      await studioMediasUploadedMessagesProducer.subscriptionMediasUploaded([media]);

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

  describe('subscriptionMediasUploadedError method', () => {
    it('should send SubscriptionMediasUploadedError', async () => {
      const eventName: RabbitMqEnum = RabbitMqEnum.SubscriptionMediasUploadedError;

      const media: string = 'test';

      const payload: any = {
        medias: [media],
      };

      await studioMediasUploadedMessagesProducer.subscriptionMediasUploadedError([media]);

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
