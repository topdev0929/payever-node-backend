/* tslint:disable:cognitive-complexity */
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CHANNEL_SET_SERVICE,
  ChannelSetServiceInterface,
  ChannelModel,
  ChannelSetModel,
  ChannelService,
} from '@pe/channels-sdk';
import { Command, Positional } from '@pe/nest-kit';
import { OPTIONAL_CHANNEL_TYPES } from '../common/const';
import { IntegrationSubscriptionModel } from '../integration/models';
import { BusinessService } from '@pe/business-kit';
import { BusinessModel } from '../business';

@Injectable()
export class UpdateOptionalChannelTypesCommand {
  constructor(
    private readonly channelService: ChannelService,
    @Inject(CHANNEL_SET_SERVICE) private readonly channelSetService: ChannelSetServiceInterface,
    private readonly businessService: BusinessService,
  ) { }

  @Command({
    command: 'channel-set:optional-types:update',
    describe: 'Updates optional channels sets from integrations',
  })
  public async updateOptionalChannelSetsFromIntegrations(
    @Positional({
      name: 'businessId',
    }) businessId: string,
  ): Promise<void> {
    Logger.log(`Starting optional channel set update`);

    const channels: ChannelModel[] = await this.channelService.findAll();
    for (const channel of channels) {
      await this.processChannel(channel, businessId);
    }
  }

  private async processChannel(channel: ChannelModel, businessId?: string): Promise<void> {
    Logger.log(`Processing channel: ${channel.type}`);

    let criteria: any = { };
    if (businessId) {
      criteria = {
        _id: businessId,
      };
    }
    Logger.log(`Criteria is ${criteria}`);
    const businesses: BusinessModel[] = await this.businessService.findAll(criteria) as BusinessModel[];
    for (const integrationName of OPTIONAL_CHANNEL_TYPES) {
      for (const business of businesses) {
        await business.populate('integrationSubscriptions').execPopulate();
        await business.populate('integrationSubscriptions.integration').execPopulate();
        const integrationSubscription: IntegrationSubscriptionModel =
          business.integrationSubscriptions.find((item: IntegrationSubscriptionModel) =>
            item.integration.name === integrationName,
          );

        const integrationInstalledAndActive: boolean = integrationSubscription && integrationSubscription.installed;
        if (integrationInstalledAndActive) {
          await business.populate('channelSets').execPopulate();
          const channelSet: ChannelSetModel = business.channelSets.find((item: ChannelSetModel) =>
            item.type === integrationName,
          );
          if (!channelSet) {
            await this.channelSetService.createChannelSetWithType(channel, business._id, integrationName);
            Logger.log(`Successfully created new channel set for channel: ${channel.type} - ${integrationName}`);
          }
        }
      }
    }

    Logger.log(`Finished channel: ${channel.type}`);
  }
}
