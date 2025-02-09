import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command } from '@pe/nest-kit/modules/command';
import { Model } from 'mongoose';
import { ShippingSettingModel, ShippingZoneModel } from '../models';
import { ShippingZoneEventsProducer } from '../producer';
import { ShippingSettingSchemaName } from '../schemas';


@Injectable()
export class ShippingZoneExportCommand {
  constructor(
    @InjectModel(ShippingSettingSchemaName) private readonly shippingSettingModel: Model<ShippingSettingModel>,
    private readonly shippingZoneEventsProducer: ShippingZoneEventsProducer,
  ) { }

  @Command({ command: 'shipping-zone:export', describe: 'Export shipping zones through the bus' })
  public async shippingZoneExport(): Promise<void> {
    const count: number = await this.shippingSettingModel.countDocuments({ $nor: [ { zones: { $size: 0 }}]}).exec();
    const limit: number = 100;
    let start: number = 0;
    let shippingSettings: ShippingSettingModel[] = [];

    while (start < count) {
      shippingSettings = await this.getWithLimit(start, limit);
      start += limit;

      for (const shippingSetting of shippingSettings) {

        await shippingSetting.populate('zones').execPopulate();

        for (const zone of shippingSetting.zones) {
          await this.shippingZoneEventsProducer
          .produceZoneExportedEvent(zone as ShippingZoneModel, shippingSetting.businessId);
        }

      }
    }
  }

  private async getWithLimit(start: number, limit: number): Promise<ShippingSettingModel[]> {
    return this.shippingSettingModel.find(
      { $nor: [ { zones: { $size: 0}}]},
      null,
      {
        limit: limit,
        skip: start,
      },
    );
  }
}
