import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Option, RabbitMqClient } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { ChannelSetSchemaName } from '../../mongoose-schema';
import { ChannelSetModel } from '../models';

@Injectable()
export class ChannelSetExportCommand {
  constructor(
    @InjectModel(ChannelSetSchemaName)
    private readonly channelSetModel: Model<ChannelSetModel>,
    private rabbitClient: RabbitMqClient,
  ) { }

  @Command({
    command: 'channelset:export [--uuid] [--after]',
    describe: 'Export channelset through the bus',
  })
  public async channelSetExport(
    @Option({
      name: 'uuid',
    }) channelSetUuid?: string,
    @Option({
      name: 'after',
    }) after?: string,
  ): Promise<void> {
    const criteria: any = { };
    if (channelSetUuid) {
      criteria._id = channelSetUuid;
    }
    if (after) {
      criteria.createdAt = { };
      criteria.createdAt.$gte = new Date(after);
    }

    const count: number = await this.channelSetModel.countDocuments(criteria);
    const limit: number = 100;
    let start: number = 0;
    let channelSets: ChannelSetModel[] = [];

    while (start < count) {
      channelSets = await this.getWithLimit(criteria, start, limit);
      start += limit;

      for (const channelSet of channelSets) {
        await this.sendEvent(channelSet);
      }
    }
  }

  private async getWithLimit(
    query: { },
    start: number,
    limit: number,
  ): Promise<ChannelSetModel[]> {
    return this.channelSetModel.find(query, null, {
      limit: limit,
      skip: start,
      sort: { createdAt: 1 },
    });
  }

  private async sendEvent(channelSet: ChannelSetModel): Promise<void> {
    return this.rabbitClient.send(
      {
        channel: 'checkout.event.channelSet.export',
        exchange: 'async_events',
      },
      {
        name: 'checkout.event.channelSet.export',
        payload: channelSet,
      },
    );
  }
}
