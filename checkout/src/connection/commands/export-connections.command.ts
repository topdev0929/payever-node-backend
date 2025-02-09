import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Option } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { CheckoutModel } from '../../checkout/models';

import { CheckoutSchemaName } from '../../mongoose-schema';
import { CheckoutConnectionRabbitProducer } from '../rabbit-producers';

@Injectable()
export class ExportConnectionsCommand {
  constructor(
    @InjectModel(CheckoutSchemaName) private readonly checkoutModel: Model<CheckoutModel>,
    private checkoutConnectionRabbitProducer: CheckoutConnectionRabbitProducer,
  ) { }

  @Command({
    command: 'checkout:connection:export [--checkout]',
    describe: 'Export connections.',
  })
  public async export(
    @Option({ name: 'checkout' }) checkout_id: string | undefined,
  ): Promise<void> {
    const criteria: any = { };
    if (checkout_id) {
      criteria._id = checkout_id;
    }

    const total: number = await this.checkoutModel.countDocuments(criteria);
    const limit: number = 1000;
    let processed: number = 0;

    while (processed < total) {
      const checkouts: CheckoutModel[] = await this.getWithLimit(processed, limit, criteria);
      Logger.log(`Starting next ${checkouts.length} checkouts.`);
      for (const checkout of checkouts) {
        for (const connection of checkout.connections) {
          await this.checkoutConnectionRabbitProducer.checkoutConnectionInstalled(connection, checkout);
        }
      }

      processed += checkouts.length;
      Logger.log(`Exported ${processed} of ${total}.`);
    }
  }

  private async getWithLimit(start: number, limit: number, criteria: any = { }): Promise<CheckoutModel[]> {
    return this.checkoutModel.find(
      criteria,
      null,
      {
        limit: limit,
        skip: start,
        sort: { _id: 1 },
      },
    )
    .populate('connections');
  }
}
