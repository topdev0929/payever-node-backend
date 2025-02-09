import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, LeanDocument } from 'mongoose';

import { Command } from '@pe/nest-kit';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { ElasticShippingOrderEnum } from '../enums';
import { ShippingOrderModel } from '../models';
import { ShippingOrderSchemaName } from '../schemas';

@Injectable()
export class ShippingOrderEsExportCommand {
  constructor(
    @InjectModel(ShippingOrderSchemaName) private readonly siteModel: Model<ShippingOrderModel>,
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly logger: Logger,
  ) { }

  /* tslint:disable:cognitive-complexity array-type */
  @Command({ command: 'shipping-order:es:export', describe: 'Export shippingOrders for ElasticSearch' })
  public async export(): Promise<void> {
    let page: number = 0;
    const limit: number = 100;

    let processedSitesCount: number = 0;
    while (true) {
      const skip: number = page * limit;

      const shippingOrders: ShippingOrderModel[] =
        await this.siteModel.find({ }).sort([['createdAt', 1]]).limit(limit).skip(skip).exec();

      if (!shippingOrders.length) {
        break;
      }

      const batch: Array<LeanDocument<ShippingOrderModel>> = [];
      for (const shippingOrder of shippingOrders) {
        batch.push({
          ...shippingOrder.toObject(),
        });
      }

      await this.elasticSearchClient.bulkIndex(
        ElasticShippingOrderEnum.index,
        batch,
      );

      processedSitesCount += shippingOrders.length;
      page++;
    }

    this.logger.log(processedSitesCount + ' shippingOrders was processed');
  }
}
