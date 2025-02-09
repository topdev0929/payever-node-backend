import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Option } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { ShopSystemModel } from '../models';
import { ShopSystemEventsProducer } from '../producers';
import { ShopSystemSchemaName } from '../schemas';

@Injectable()
export class ShopSystemExportCommand {
  constructor(
    @InjectModel(ShopSystemSchemaName)
    private readonly pluginModel: Model<ShopSystemModel>,
    private readonly pluginEventsProducer: ShopSystemEventsProducer,
  ) { }

  @Command({
    command: 'shop-system:export [--uuid]',
    describe: 'Export shop system through the bus',
  })
  public async pluginExport(
    @Option({
      name: 'uuid',
    })
    pluginUuid: string,
  ): Promise<void> {
    if (pluginUuid) {
      const plugin: ShopSystemModel = await this.pluginModel.findById(
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
      let plugins: ShopSystemModel[] = [];

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
  ): Promise<ShopSystemModel[]> {
    return this.pluginModel.find({ }, null, {
      limit: limit,
      skip: start,
      sort: { createdAt: 1 },
    });
  }

  private async sendEvent(plugin: ShopSystemModel): Promise<void> {
    return this.pluginEventsProducer.produceShopSystemExportEvent(plugin);
  }
}
