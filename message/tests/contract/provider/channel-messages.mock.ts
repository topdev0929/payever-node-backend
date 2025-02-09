import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import * as uuid from 'uuid';
import { ChannelRmqEventsEnum, RMQEventsEnum } from '../../../src/message/enums'
import { ChannelEventProducer } from '../../../src/message/submodules/platform/producers';
import { RMQEventsProducer } from "../../../src/message/producers/rmq-events.producer";
import { WidgetsDataProducer } from "../../../src/message/producers";

@Injectable()
export class ChannelMessagesMock extends AbstractMessageMock {

  private chat:any ={
    "_id" : "e3900fc7-c18a-4f7b-93f9-dccddb2c66d2",
    "id" : "e3900fc7-c18a-4f7b-93f9-dccddb2c66d2",
    "deleted" : false,
    "signed" : false,
    "type" : "app-channel",
    "app" : "studio",
    "business" : "07dcef18-a4ed-45be-aff8-a9425f53c3a4",
    "expiresAt" : null,
    "lastMessages" : [
      { "content": "iloveorange" },
    ],
    "members" : [

    ],
    "photo" : "",
    "salt" : "a468c397-082d-4c23-8049-c9799add88d9",
    "template" : "d8b4e8cc-b247-4385-8cbc-00746bbd08d2",
    "title" : "studio",
    "pinned" : [

    ],
    "removedMembers" : [

    ],
    "invitedMembers" : [

    ],
    "createdAt" : "2023-07-04T15:01:57.580+0000",
    "updatedAt" : "2023-07-04T15:01:57.580+0000",
    "__v" : 0
}


  @PactRabbitMqMessageProvider(ChannelRmqEventsEnum.ChannelCreated)
  public async mockProduceChannelCreatedEvent(): Promise<void> {
    const producer: ChannelEventProducer = await this.getProvider<ChannelEventProducer>(
      ChannelEventProducer,
    );
    await producer.produceChannelCreationEvent(this.chat);
  }

  @PactRabbitMqMessageProvider(RMQEventsEnum.WidgetDataCreated)
  public async mockWidgetDataCreated(): Promise<void> {
    const producer: WidgetsDataProducer = await this.getProvider<WidgetsDataProducer>(
      WidgetsDataProducer,
    );
    await producer.chatCreated(this.chat);
  }

  @PactRabbitMqMessageProvider(RMQEventsEnum.WidgetDataUpdated)
  public async mockWidgetDataUpdated(): Promise<void> {
    const producer: WidgetsDataProducer = await this.getProvider<WidgetsDataProducer>(
      WidgetsDataProducer,
    );
    await producer.chatUpdated(this.chat);
  }

  @PactRabbitMqMessageProvider(RMQEventsEnum.WidgetDataDeleted)
  public async mockWidgetDataDeleted(): Promise<void> {
    const producer: WidgetsDataProducer = await this.getProvider<WidgetsDataProducer>(
      WidgetsDataProducer,
    );
    await producer.chatDeleted(this.chat);
  }

  @PactRabbitMqMessageProvider(RMQEventsEnum.WidgetDataExported)
  public async mockWidgetDataExported(): Promise<void> {
    const producer: RMQEventsProducer = await this.getProvider<RMQEventsProducer>(
      RMQEventsProducer,
    );
    await producer.produceWidgetDataUpdatedEvent(this.chat, RMQEventsEnum.WidgetDataExported);
  }
}
