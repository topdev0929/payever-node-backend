import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { CampaignModel } from '../models';
import { RabbitMessage } from '../enums/rabbit-message.enum';

@Injectable()
export class CampaignEventsProducer {

  private logger: Logger = new Logger(CampaignEventsProducer.name, true);
  constructor(
    private loggerInject: Logger,
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async applicationCreated(campaign: CampaignModel): Promise<void> {
    this.logger.log(`send ${RabbitMessage.CampaignCreated} event`);
    await this.rabbitClient
      .send(
        {
          channel: RabbitMessage.CampaignCreated,
          exchange: 'async_events',
        },
        {
          name: RabbitMessage.CampaignCreated,
          payload: {
            appType: 'marketing',
            business: {
              id: campaign.business,
            },
            id: campaign.id,
            name: campaign.name,
          },
        },
      );

    await this.rabbitClient
      .send(
        {
          channel: RabbitMessage.ApplicationCreated,
          exchange: 'async_events',
        },
        {
          name: RabbitMessage.ApplicationCreated,
          payload: {
            business: campaign.business,
            id: campaign.id,
            type: 'marketing',
          },
        },
      );
  }

  public async campaignCreated(campaign: CampaignModel): Promise<void> {
    await this.rabbitClient
      .send(
        {
          channel: RabbitMessage.CampaignCreationDone,
          exchange: 'async_events',
        },
        {
          name: RabbitMessage.CampaignCreationDone,
          payload: {
            business: campaign.business,
            channelSet: campaign.channelSet,
            contactsCount: campaign.contacts.length,
            id: campaign.id,
            name: campaign.name,
          },
        },
      );
  }

  public async applicationRemoved(businessId: string, campaignId: string): Promise<void> {
    this.logger.log(`send ${RabbitMessage.CampaignRemoved} event`);
    await this.rabbitClient
      .send(
        {
          channel: RabbitMessage.CampaignRemoved,
          exchange: 'async_events',
        },
        {
          name: RabbitMessage.CampaignRemoved,
          payload: {
            appType: 'marketing',
            business: {
              id: businessId,
            },
            id: campaignId,
          },
        },
      );

    await this.rabbitClient
      .send(
        {
          channel: RabbitMessage.ApplicationRemoved,
          exchange: 'async_events',
        },
        {
          name: RabbitMessage.ApplicationRemoved,
          payload: {
            id: campaignId,
          },
        },
      );
  }

  public async campaignSend(campaignData: any): Promise<void> {
    await this.rabbitClient
      .send(
        {
          channel: RabbitMessage.CampaignSend,
          exchange: 'async_events',
        },
        {
          name: RabbitMessage.CampaignSend,
          payload: {
            campaign: campaignData,
          },
        },
      );
  }
}
