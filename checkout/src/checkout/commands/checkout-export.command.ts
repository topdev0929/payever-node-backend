import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Option } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { CheckoutSchemaName } from '../../mongoose-schema';
import { CheckoutModel } from '../models';
import { RabbitEventsProducer } from '../../common/producer';

@Injectable()
export class CheckoutExportCommand {
  constructor(
    @InjectModel(CheckoutSchemaName)
    private readonly checkoutModel: Model<CheckoutModel>,
    private readonly rabbitEventsProducer: RabbitEventsProducer,
  ) { }

  @Command({
    command: 'checkout:export [--uuid] [--after]',
    describe: 'Export checkouts through the bus',
  })
  public async checkoutExport(
    @Option({
      name: 'uuid',
    }) checkoutId?: string,
    @Option({
      name: 'after',
    }) after?: string,
  ): Promise<void> {
    const criteria: any = { };
    if (checkoutId) {
      criteria._id = checkoutId;
    }
    if (after) {
      criteria.createdAt = { };
      criteria.createdAt.$gte = new Date(after);
    }

    const count: number = await this.checkoutModel.countDocuments(criteria);
    const limit: number = 100;
    let start: number = 0;
    let checkouts: CheckoutModel[] = [];

    while (start < count) {
      checkouts = await this.getWithLimit(criteria, start, limit);
      start += limit;

      for (const checkout of checkouts) {
        await this.rabbitEventsProducer.businessCheckoutExport(checkout);
      }
    }
  }

  private async getWithLimit(
    query: { },
    start: number,
    limit: number,
  ): Promise<CheckoutModel[]> {
    return this.checkoutModel.find(query, null, {
      limit: limit,
      skip: start,
      sort: { createdAt: 1 },
    });
  }
}
