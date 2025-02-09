import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Command, Option } from '@pe/nest-kit';
import { PluginCommandModel } from '../models';
import { PluginCommandEventsProducer } from '../producers';
import { PluginCommandSchemaName } from '../schemas';

@Injectable()
export class PluginCommandExportCommand {
  constructor(
    @InjectModel(PluginCommandSchemaName)
    private readonly pluginCommandModel: Model<PluginCommandModel>,
    private readonly pluginCommandEventsProducer: PluginCommandEventsProducer,
  ) { }

  @Command({
    command: 'plugin-command:export [--uuid]',
    describe: 'Export plugin command through the bus',
  })
  public async pluginCommandExport(
    @Option({
      name: 'uuid',
    })
    pluginCommandUuid: string,
  ): Promise<void> {
    if (pluginCommandUuid) {
      const pluginCommand: PluginCommandModel = await this.pluginCommandModel.findById(
        pluginCommandUuid,
      ).exec();
      if (!pluginCommand) {
        throw Error(`Unable to find pluginCommand: ${pluginCommandUuid}`);
      }

      await this.sendEvent(pluginCommand);
    } else {
      const count: number = await this.pluginCommandModel.countDocuments({ }).exec();
      const limit: number = 10;
      let start: number = 0;
      let pluginCommands: PluginCommandModel[] = [];

      while (start < count) {
        pluginCommands = await this.getWithLimit(start, limit);
        start += limit;

        for (const pluginCommand of pluginCommands) {
          await this.sendEvent(pluginCommand);
        }
      }
    }
  }

  private async getWithLimit(
    start: number,
    limit: number,
  ): Promise<PluginCommandModel[]> {
    return this.pluginCommandModel.find({ }, null, {
      limit: limit,
      skip: start,
      sort: { createdAt: 1 },
    });
  }

  private async sendEvent(plugin: PluginCommandModel): Promise<void> {
    return this.pluginCommandEventsProducer.producePluginCommandExportEvent(plugin);
  }
}
