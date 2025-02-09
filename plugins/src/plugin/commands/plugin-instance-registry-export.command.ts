import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Command, Option } from '@pe/nest-kit';
import { PluginInstanceRegistryModel } from '../models';
import { PluginInstanceRegistryEventsProducer } from '../producers';
import { PluginInstanceRegistrySchemaName } from '../schemas';

@Injectable()
export class PluginInstanceRegistryExportCommand {
  constructor(
    @InjectModel(PluginInstanceRegistrySchemaName)
    private readonly pluginInstanceRegistryModel: Model<PluginInstanceRegistryModel>,
    private readonly pluginInstanceRegistryEventsProducer: PluginInstanceRegistryEventsProducer,
  ) { }

  @Command({
    command: 'plugin-instance-registry:export [--uuid]',
    describe: 'Export plugin instance registry through the bus',
  })
  public async pluginInstanceRegistryExport(
    @Option({
      name: 'uuid',
    })
    pluginInstanceRegistryUuid: string,
  ): Promise<void> {
    if (pluginInstanceRegistryUuid) {
      const pluginInstanceRegistry: PluginInstanceRegistryModel = await this.pluginInstanceRegistryModel.findById(
        pluginInstanceRegistryUuid,
      ).exec();
      if (!pluginInstanceRegistry) {
        throw Error(`Unable to find pluginInstanceRegistry: ${pluginInstanceRegistryUuid}`);
      }

      await this.sendEvent(pluginInstanceRegistry);
    } else {
      const count: number = await this.pluginInstanceRegistryModel.countDocuments({ }).exec();
      const limit: number = 10;
      let start: number = 0;
      let pluginInstanceRegistries: PluginInstanceRegistryModel[] = [];

      while (start < count) {
        pluginInstanceRegistries = await this.getWithLimit(start, limit);
        start += limit;

        for (const pluginInstanceRegistry of pluginInstanceRegistries) {
          await this.sendEvent(pluginInstanceRegistry);
        }
      }
    }
  }

  private async getWithLimit(
    start: number,
    limit: number,
  ): Promise<PluginInstanceRegistryModel[]> {
    return this.pluginInstanceRegistryModel.find({ }, null, {
      limit: limit,
      skip: start,
      sort: { createdAt: 1 },
    });
  }

  private async sendEvent(plugin: PluginInstanceRegistryModel): Promise<void> {
    return this.pluginInstanceRegistryEventsProducer.producePluginInstanceRegistryExportEvent(plugin);
  }
}
