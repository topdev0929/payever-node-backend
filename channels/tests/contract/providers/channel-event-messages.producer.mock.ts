import { Injectable } from "@nestjs/common";
import {
  ChannelAwareBusinessModel,
  ChannelEventMessagesProducer,
  ChannelModel,
  ChannelSetModel,
  ChannelsRabbitEventEnum,
} from "@pe/channels-sdk";
import * as uuid from 'uuid';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from "@pe/pact-kit";

@Injectable()
export class ChannelEventMessagesProducerMock extends AbstractMessageMock {
  
  private channelSet: ChannelSetModel = { id: uuid.v4() } as ChannelSetModel
  private business: ChannelAwareBusinessModel = { id: uuid.v4() } as ChannelAwareBusinessModel
  private channel: ChannelModel = { id: uuid.v4() } as ChannelModel

  @PactRabbitMqMessageProvider(ChannelsRabbitEventEnum.ChannelSetCreated)
  public async mockSendChannelSetCreatedMessage(): Promise<void> {
    const producer: ChannelEventMessagesProducer =
      await this.getProvider<ChannelEventMessagesProducer>(
        ChannelEventMessagesProducer
      );
    await producer.sendChannelSetCreatedMessage(this.channelSet, this.business.id, this.channel);
  }

  @PactRabbitMqMessageProvider(ChannelsRabbitEventEnum.ChannelSetUpdated)
  public async mockSendChannelSetUpdatedMessage(): Promise<void> {
    const producer: ChannelEventMessagesProducer =
      await this.getProvider<ChannelEventMessagesProducer>(
        ChannelEventMessagesProducer
      );
    await producer.sendChannelSetUpdatedMessage(this.channelSet);
  }

  @PactRabbitMqMessageProvider(ChannelsRabbitEventEnum.ChannelSetDeleted)
  public async mockSendChannelSetDeletedMessage(): Promise<void> {
    const producer: ChannelEventMessagesProducer =
      await this.getProvider<ChannelEventMessagesProducer>(
        ChannelEventMessagesProducer
      );
    await producer.sendChannelSetDeletedMessage(uuid.v4());
  }

  @PactRabbitMqMessageProvider(ChannelsRabbitEventEnum.ChannelSetCreatedByDefault)
  public async mockSendChannelSetCreatedByDefault(): Promise<void> {
    const producer: ChannelEventMessagesProducer =
      await this.getProvider<ChannelEventMessagesProducer>(
        ChannelEventMessagesProducer
      );
    await producer.sendChannelSetCreatedByDefault(this.channelSet, uuid.v4());
  }

  @PactRabbitMqMessageProvider(ChannelsRabbitEventEnum.ChannelSetNamed)
  public async mockSendChannelSetNamedByApplication(): Promise<void> {
    const producer: ChannelEventMessagesProducer =
      await this.getProvider<ChannelEventMessagesProducer>(
        ChannelEventMessagesProducer
      );
    await producer.sendChannelSetNamedByApplication(this.channelSet, 'name');
  }

  @PactRabbitMqMessageProvider(ChannelsRabbitEventEnum.ChannelSetActivated)
  public async mockSendChannelSetActivated(): Promise<void> {
    const producer: ChannelEventMessagesProducer =
      await this.getProvider<ChannelEventMessagesProducer>(
        ChannelEventMessagesProducer
      );
    await producer.sendChannelSetActivated(this.channelSet, this.business);
  }
}
