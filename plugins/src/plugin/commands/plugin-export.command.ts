import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Command, Option } from '@pe/nest-kit';
import { PluginModel } from '../models';
import { PluginEventsProducer } from '../producers';
import { PluginSchemaName } from '../schemas';

@Injectable()
export class PluginExportCommand {
  constructor(
    @InjectModel(PluginSchemaName)
    private readonly pluginModel: Model<PluginModel>,
    private readonly pluginEventsProducer: PluginEventsProducer,
  ) { }

  @Command({
    command: 'plugin:export [--uuid]',
    describe: 'Export plugin through the bus',
  })
  public async pluginExport(
    @Option({
      name: 'uuid',
    })
    pluginUuid: string,
  ): Promise<void> {
    if (pluginUuid) {
      const plugin: PluginModel = await this.pluginModel.findById(
        pluginUuid,
      ).exec();
      if (!plugin) {
        throw Error(`Unable to find plugin: ${pluginUuid}`);
      }

      await this.sendEvent(plugin);
    } else {
      const count: number = await this.pluginModel.countDocuments({ }).exec();
      const limit: number = 10;
      let start: number = 0;
      let plugins: PluginModel[] = [];

      while (start < count) {
        plugins = await this.getWithLimit(start, limit);
        start += limit;

        for (const plugin of plugins) {
          await this.sendEvent(plugin);
        }
      }
    }
  }

  private async getWithLimit(
    start: number,
    limit: number,
  ): Promise<PluginModel[]> {
    return this.pluginModel.find({ }, null, {
      limit: limit,
      skip: start,
      sort: { createdAt: 1 },
    });
  }

  private async sendEvent(plugin: PluginModel): Promise<void> {
    return this.pluginEventsProducer.producePluginExportEvent(plugin);
  }
}
