import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Command, Option } from '@pe/nest-kit';
import { PluginFileModel } from '../models';
import { PluginFileEventsProducer } from '../producers';
import { PluginFileSchemaName } from '../schemas';

@Injectable()
export class PluginFileExportCommand {
  constructor(
    @InjectModel(PluginFileSchemaName)
    private readonly pluginFileModel: Model<PluginFileModel>,
    private readonly pluginFileEventsProducer: PluginFileEventsProducer,
  ) { }

  @Command({
    command: 'plugin-file:export [--uuid]',
    describe: 'Export plugin file through the bus',
  })
  public async pluginFileExport(
    @Option({
      name: 'uuid',
    })
    pluginFileUuid: string,
  ): Promise<void> {
    if (pluginFileUuid) {
      const pluginFile: PluginFileModel = await this.pluginFileModel.findById(
        pluginFileUuid,
      ).exec();
      if (!pluginFile) {
        throw Error(`Unable to find pluginFile: ${pluginFileUuid}`);
      }

      await this.sendEvent(pluginFile);
    } else {
      const count: number = await this.pluginFileModel.countDocuments({ }).exec();
      const limit: number = 10;
      let start: number = 0;
      let pluginFiles: PluginFileModel[] = [];

      while (start < count) {
        pluginFiles = await this.getWithLimit(start, limit);
        start += limit;

        for (const pluginFile of pluginFiles) {
          await this.sendEvent(pluginFile);
        }
      }
    }
  }

  private async getWithLimit(
    start: number,
    limit: number,
  ): Promise<PluginFileModel[]> {
    return this.pluginFileModel.find({ }, null, {
      limit: limit,
      skip: start,
      sort: { createdAt: 1 },
    });
  }

  private async sendEvent(plugin: PluginFileModel): Promise<void> {
    return this.pluginFileEventsProducer.producePluginFileExportEvent(plugin);
  }
}
