import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command } from '@pe/nest-kit/modules/command';
import { Model } from 'mongoose';
import { ShippingSettingModel } from '../models';
import { ShippingSettingEventsProducer } from '../producer';
import { ShippingSettingSchemaName } from '../schemas';


@Injectable()
export class ShippingSettingExportCommand {
  constructor(
    @InjectModel(ShippingSettingSchemaName) private readonly shippingSettingModel: Model<ShippingSettingModel>,
    private readonly shippingSettingEventsProducer: ShippingSettingEventsProducer,
  ) { }

  @Command({ command: 'shipping-setting:export', describe: 'Export shipping settings through the bus' })
  public async shippingSettingExport(): Promise<void> {
    const count: number = await this.shippingSettingModel.countDocuments({ }).exec();
    const limit: number = 100;
    let start: number = 0;
    let shippingSettings: ShippingSettingModel[] = [];

    while (start < count) {
      shippingSettings = await this.getWithLimit(start, limit);
      start += limit;

      for (const shippingSetting of shippingSettings) {
        await this.shippingSettingEventsProducer.produceSettingExportedEvent(shippingSetting);
      }
    }
  }

  private async getWithLimit(start: number, limit: number): Promise<ShippingSettingModel[]> {
    return this.shippingSettingModel.find(
      { },
      null,
      {
        limit: limit,
        skip: start,
      },
    );
  }
}
