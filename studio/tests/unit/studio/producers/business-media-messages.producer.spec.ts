import 'mocha';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as uuid from 'uuid';
import { Test } from '@nestjs/testing';
import { RabbitMqClient } from '@pe/nest-kit';
import { BusinessMediaMessagesProducer } from '../../../../src/studio/producers';
import { MediaMessagesEnum } from '../../../../src/studio/enums';
import { UserMediaModel } from '../../../../src/studio/models';

chai.use(sinonChai);
const expect = chai.expect;

describe('BusinessMediaMessagesProducer ', () => {
  let sandbox: sinon.SinonSandbox;
  let businessMediaMessagesProducer: BusinessMediaMessagesProducer;
  let rabbitMqClient: RabbitMqClient;

  const business: any = {
    id: uuid.v4(),
  } as any;

  before(async () => {
    const module = await Test.createTestingModule({
      controllers: [BusinessMediaMessagesProducer],
      providers: [
        {
          provide: RabbitMqClient,
          useValue: {
            send: () => { },
          },
        },
      ],
    }).compile();

    rabbitMqClient = module.get<RabbitMqClient>(RabbitMqClient);
    businessMediaMessagesProducer = module.get<BusinessMediaMessagesProducer>(BusinessMediaMessagesProducer);
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    sandbox.stub(rabbitMqClient, 'send').resolves();
  });

  afterEach(async () => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('sendMediaCreatedMessage method', () => {
    it('should send BusinessMediaCreated', async () => {
      const eventName: MediaMessagesEnum = MediaMessagesEnum.BusinessMediaCreated;

      const media: UserMediaModel = {
      } as any;

      const payload: any = {
        business: {
          id: media.businessId,
        },
        id: media.id,
        mediaType: media.mediaType,
        name: media.name,
        url: media.url,
      };

      await businessMediaMessagesProducer.sendMediaCreatedMessage(media);

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

  describe('sendMediaUpdatedMessage method', () => {
    it('should send BusinessMediaUpdated', async () => {
      const eventName: MediaMessagesEnum = MediaMessagesEnum.BusinessMediaUpdated;

      const media: UserMediaModel = {
      } as any;

      const payload: any = {
        business: {
          id: media.businessId,
        },
        id: media.id,
        mediaType: media.mediaType,
        name: media.name,
        url: media.url,
      };

      await businessMediaMessagesProducer.sendMediaUpdatedMessage(media);

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

  describe('sendMediaDeletedMessage method', () => {
    it('should send BusinessMediaDeleted', async () => {
      const eventName: MediaMessagesEnum = MediaMessagesEnum.BusinessMediaDeleted;

      const media: UserMediaModel = {
      } as any;

      const payload: any = {
        business: {
          id: media.businessId,
        },
        id: media.id,
        mediaType: media.mediaType,
        name: media.name,
        url: media.url,
      };

      await businessMediaMessagesProducer.sendMediaDeletedMessage(media);

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
