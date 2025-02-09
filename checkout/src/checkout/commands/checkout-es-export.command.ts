import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentDefinition, Model } from 'mongoose';
import { Command } from '@pe/nest-kit';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { ElasticCheckoutEnum } from '../enums';
import { CheckoutModel } from '../models';
import { CheckoutSchemaName } from '../../mongoose-schema';

@Injectable()
export class CheckoutEsExportCommand {
  constructor(
    @InjectModel(CheckoutSchemaName) 
    private readonly checkoutModel: Model<CheckoutModel>,
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly logger: Logger,
  ) { }

  @Command({ command: 'checkout:es:export', describe: 'Export checkouts for ElasticSearch' })
  public async export(): Promise<void> {
    let page: number = 0;
    const limit: number = 100;

    let processedCheckoutsCount: number = 0;
    while (true) {
      const skip: number = page * limit;

      const checkouts: CheckoutModel[] =
        await this.checkoutModel.find({ }).sort([['createdAt', 1]]).limit(limit).skip(skip);

      if (!checkouts.length) {
        break;
      }

      const batch: Array<DocumentDefinition<CheckoutModel>> = [];
      for (const checkout of checkouts) {
        batch.push({
          ...checkout.toObject(),
        });
      }

      await this.elasticSearchClient.bulkIndex(
        ElasticCheckoutEnum.index,
        batch,
      );

      processedCheckoutsCount += checkouts.length;
      page++;
    }

    this.logger.log(processedCheckoutsCount + ' checkouts was processed');
  }
}
