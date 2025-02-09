import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import * as uuid from 'uuid';
import { InnerEventProducer } from "../../../src/social/producers";
import {
  MediaTypeEnum,
  PostRabbitEventsEnum,
  PostSentStatusEnum,
  PoststatusEnum,
  PostTypeEnum
} from "../../../src/social/enums";
import { BusinessInterface, BusinessLocalModel } from "../../../src/business";
import { MediaInterface, PostModel } from "../../../src/social";
import { PostStateInterface } from "../../../src/social/interfaces/post-state.interface";
import { ChannelSetInterface } from "../../../src/channel-set";

@Injectable()
export class SocialMessagesMock extends AbstractMessageMock {
  private post: PostModel = {
    id: uuid.v4(),
    title: `string`,
    content: `string`,
    postState: [],
    mediaType: MediaTypeEnum.Image,
    channelSet: [],
    businessId: uuid.v4(),
    sentStatus: PostSentStatusEnum.Sent,
    status: PoststatusEnum.PostNow,
    type: PostTypeEnum.Post,
  } as PostModel;

  @PactRabbitMqMessageProvider(PostRabbitEventsEnum.SocialPostCreated)
  public async SocialPostCreated(): Promise<void> {
    const producer: InnerEventProducer = await this.getProvider<InnerEventProducer>(InnerEventProducer);
    await producer.send(PostRabbitEventsEnum.SocialPostCreated, this.post);
  }
  @PactRabbitMqMessageProvider(PostRabbitEventsEnum.SocialPostUpdated)
  public async SocialPostUpdated(): Promise<void> {
    const producer: InnerEventProducer = await this.getProvider<InnerEventProducer>(InnerEventProducer);
    await producer.send(PostRabbitEventsEnum.SocialPostUpdated, this.post);
  }
  @PactRabbitMqMessageProvider(PostRabbitEventsEnum.SocialPostExported)
  public async SocialPostExported(): Promise<void> {
    const producer: InnerEventProducer = await this.getProvider<InnerEventProducer>(InnerEventProducer);
    await producer.send(PostRabbitEventsEnum.SocialPostExported, this.post);
  }
  @PactRabbitMqMessageProvider(PostRabbitEventsEnum.SocialPostDeleted)
  public async SocialPostDeleted(): Promise<void> {
    const producer: InnerEventProducer = await this.getProvider<InnerEventProducer>(InnerEventProducer);
    await producer.send(PostRabbitEventsEnum.SocialPostDeleted, this.post);
  }
}
