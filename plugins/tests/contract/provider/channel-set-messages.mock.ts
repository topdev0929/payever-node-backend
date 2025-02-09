import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import * as uuid from 'uuid';
import {
  ChannelsRabbitEventEnum, ChannelEventMessagesProducer,
  channelSetModelFake, channelAwareBusinessModelFake, channelModelFake,
} from '@pe/channels-sdk';


@Injectable()
export class ChannelEventMessagesProducerMock extends AbstractMessageMock {

  @PactRabbitMqMessageProvider(ChannelsRabbitEventEnum.ChannelSetCreated)
  public async mockChannelSetCreated(): Promise<void> {
    const producer: ChannelEventMessagesProducer =
      await this.getProvider<ChannelEventMessagesProducer>(ChannelEventMessagesProducer);
    await producer.sendChannelSetCreatedMessage(
      channelSetModelFake,
      channelAwareBusinessModelFake,
      channelModelFake,
    )
  }

  @PactRabbitMqMessageProvider(ChannelsRabbitEventEnum.ChannelSetDeleted)
  public async mockChannelSetDeleted(): Promise<void> {
    const producer: ChannelEventMessagesProducer =
      await this.getProvider<ChannelEventMessagesProducer>(ChannelEventMessagesProducer);
    await producer.sendChannelSetDeletedMessage(uuid.v4());
  }

  @PactRabbitMqMessageProvider(ChannelsRabbitEventEnum.ChannelSetCreatedByDefault)
  public async mockChannelSetCreatedByDefault(): Promise<void> {
    const producer: ChannelEventMessagesProducer =
      await this.getProvider<ChannelEventMessagesProducer>(ChannelEventMessagesProducer);
    producer.sendChannelSetCreatedByDefault(
      channelSetModelFake,
      uuid.v4(),
    )
  }

  @PactRabbitMqMessageProvider(ChannelsRabbitEventEnum.ChannelSetNamed)
  public async mockChannelSetNamed(): Promise<void> {
    const producer: ChannelEventMessagesProducer =
      await this.getProvider<ChannelEventMessagesProducer>(ChannelEventMessagesProducer);
    producer.sendChannelSetNamedByApplication(
      channelSetModelFake,
      'testName',
    )
  }

  @PactRabbitMqMessageProvider(ChannelsRabbitEventEnum.ChannelSetActivated)
  public async mockChannelSetActivated(): Promise<void> {
    const producer: ChannelEventMessagesProducer =
      await this.getProvider<ChannelEventMessagesProducer>(ChannelEventMessagesProducer);
    producer.sendChannelSetActivated(
      channelSetModelFake,
      channelAwareBusinessModelFake,
    )
  }

}
