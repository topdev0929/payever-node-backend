import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Option } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { CheckoutSchemaName, ChannelSetSchemaName } from '../../mongoose-schema';
import { ChannelSetModel } from '../../channel-set';
import { CheckoutModel } from '../index';
import { RabbitEventsProducer } from '../../common';

@Injectable()
export class CreateMissedChannelsSetsCommand {
  constructor(
    @InjectModel(CheckoutSchemaName) private readonly checkoutModel: Model<CheckoutModel>,
    @InjectModel(ChannelSetSchemaName) private readonly channelSetModel: Model<ChannelSetModel>,
    private readonly rabbitEventsProducer: RabbitEventsProducer,
    private readonly logger: Logger,
  ) { }

  @Command({
    command: 'create-missed-channel-sets',
    describe: 'Create missed Channel Sets for checkouts',
  })
  public async createMissedChannelSets(
    @Option({
      name: 'businessId',
    }) businessId?: string,
  ): Promise<void> {
    const CHANNEL_LINK: string = 'link';
    const CHANNEL_FINANCE_EXPRESS: string = 'finance_express';

    let criteria: any = { };

    if (businessId) {
      criteria = {
        businessId: businessId,
        ...criteria,
      };
    }

    const count: number = await this.checkoutModel.countDocuments(criteria);
    this.logger.log(`Start check ${count} checkouts, criteria: ${JSON.stringify(criteria)}`);

    const limit: number = 100;
    let start: number = 0;
    let checkouts: CheckoutModel[] = [];
    while (start < count) {
      checkouts = await this.getWithLimit(start, limit);
      start += limit;

      for (const checkout of checkouts) {
        const channelSets: ChannelSetModel[] = await this.channelSetModel.find({
          checkout: checkout._id,
        });

        const missedChannels: boolean =
          !channelSets.find((channel) => (channel.name === CHANNEL_LINK))
        || !channelSets.find((channel) => (channel.name === CHANNEL_FINANCE_EXPRESS));

        if (missedChannels) {
          this.logger.log(`Found missed channel for checkout ${checkout._id}`);
          await this.rabbitEventsProducer.businessCheckoutChannelSetExport(checkout);
        }
      }
      this.logger.log(`Checked ${start} checkouts`);
    }
  }

  private async getWithLimit(start: number, limit: number): Promise<CheckoutModel[]> {
    return this.checkoutModel.find(
      { },
      null,
      {
        sort: { createdAt: 1 },

        limit: limit,
        skip: start,
      },
    );
  }
}
