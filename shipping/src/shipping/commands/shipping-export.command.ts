import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command } from '@pe/nest-kit/modules/command';
import { Model } from 'mongoose';
import { ShippingOrderModel } from '../models';
import { ShippingOrderEventsProducer } from '../producer';
import { ShippingOrderSchemaName } from '../schemas';


@Injectable()
export class ShippingOrderExportCommand {
  constructor(
    @InjectModel(ShippingOrderSchemaName) private readonly shippingOrderModel: Model<ShippingOrderModel>,
    private readonly shippingOrderEventsProducer: ShippingOrderEventsProducer,
  ) { }

  @Command({ command: 'shipping-order:export', describe: 'Export shipping orders through the bus' })
  public async shippingOrderExport(): Promise<void> {
    const count: number = await this.shippingOrderModel.countDocuments({ }).exec();
    const limit: number = 100;
    let start: number = 0;
    let shippingOrders: ShippingOrderModel[] = [];

    while (start < count) {
      shippingOrders = await this.getWithLimit(start, limit);
      start += limit;

      for (const shippingOrder of shippingOrders) {
        await this.shippingOrderEventsProducer.produceOrderExportedEvent(shippingOrder);
      }
    }
  }

  private async getWithLimit(start: number, limit: number): Promise<ShippingOrderModel[]> {
    return this.shippingOrderModel.find(
      { },
      null,
      {
        limit: limit,
        skip: start,
        sort: { createdAt: 1 },
      },
    );
  }
}
