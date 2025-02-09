import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business';
import { BusinessSchemaName } from '../../mongoose-schema';
import { ChannelSetModel } from '../models';
import { ChannelSetRabbitProducer } from '../producers';

@Injectable()
export class ChannelSetByBusinessExportCommand {
  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    private readonly channelSetRabbitProducer: ChannelSetRabbitProducer,
  ) { }

  @Command({
    command: 'channel_set_by_business:export',
    describe: 'Export channelSet through the bus',
  })
  public async channelSetByBusinessExport(): Promise<void> {

    const count: number = await this.businessModel.countDocuments({ });
    const limit: number = 100;
    let start: number = 0;
    let businesses: BusinessModel[] = [];
    while (start < count) {
      businesses = await this.getWithLimit(start, limit);
      start += limit;

      for (const business of businesses) {
        await business.populate('channelSets').execPopulate();
        for (const channelSet of business.channelSets) {
          // payload should be the same as in the
          // channels-sdk/src/producers/channel-event-messages.producer.ts/#sendChannelSetCreatedMessage
          await this.channelSetRabbitProducer.channelSetByBusinessExportMessage(
            business,
            channelSet as ChannelSetModel,
          );
        }
      }
    }
  }

  private async getWithLimit(start: number, limit: number): Promise<BusinessModel[]> {
    return this.businessModel.find(
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
