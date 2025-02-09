import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import * as uuid from 'uuid';
import { CampaignModel } from '../../../src/modules/campaign/models';
import { CampaignEventsProducer } from '../../../src/modules/campaign/producers';
import { RabbitMessage } from '../../../src/modules/campaign/enums';

@Injectable()
export class CampaignMessagesMock extends AbstractMessageMock {
  private campaign: CampaignModel = {
    business: uuid.v4(),
    channelSet: uuid.v4(),
    contacts: [],
    date: new Date(),
    id: uuid.v4(),
    name: 'Some Campaign',
    status: 'Some Status',
  } as CampaignModel;

  @PactRabbitMqMessageProvider(RabbitMessage.CampaignCreated)
  @PactRabbitMqMessageProvider(RabbitMessage.ApplicationCreated)
  public async mockApplicationCreated(): Promise<void> {
    const producer: CampaignEventsProducer = await this.getProvider<CampaignEventsProducer>(CampaignEventsProducer);
    producer.applicationCreated(this.campaign).catch();
  }

  @PactRabbitMqMessageProvider(RabbitMessage.CampaignCreationDone)
  public async mockCampaignCreated(): Promise<void> {
    const producer: CampaignEventsProducer = await this.getProvider<CampaignEventsProducer>(CampaignEventsProducer);
    producer.campaignCreated(this.campaign).catch();
  }

  @PactRabbitMqMessageProvider(RabbitMessage.CampaignRemoved)
  public async mockApplicationRemoved(): Promise<void> {
    const producer: CampaignEventsProducer = await this.getProvider<CampaignEventsProducer>(CampaignEventsProducer);
    producer.applicationRemoved(
      uuid.v4(), uuid.v4(),
    ).catch();
  }

}
