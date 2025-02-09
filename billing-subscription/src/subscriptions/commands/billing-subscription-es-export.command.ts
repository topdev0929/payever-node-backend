import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentDefinition, Model, LeanDocument } from 'mongoose';

import { Command } from '@pe/nest-kit';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { ElasticBillingSubscriptionEnum } from '../enums';
import { SubscriptionModel } from '../models';
import { SubscriptionSchemaName } from '../schemas';

@Injectable()
export class BillingSubscriptionEsExportCommand {
  constructor(
    @InjectModel(SubscriptionSchemaName) private readonly subscriptionModel: Model<SubscriptionModel>,
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly logger: Logger,
  ) { }

  /* tslint:disable:cognitive-complexity array-type */
  @Command({ command: 'billing-subscription:es:export', describe: 'Export billingSubscriptions for ElasticSearch' })
  public async export(): Promise<void> {
    let page: number = 0;
    const limit: number = 100;

    let processedBillingSubscriptionsCount: number = 0;
    while (true) {
      const skip: number = page * limit;

      const billingSubscriptions: SubscriptionModel[] =
        await this.subscriptionModel.find({ }).sort([['createdAt', 1]]).limit(limit).skip(skip);

      if (!billingSubscriptions.length) {
        break;
      }

      const batch: Array<LeanDocument<SubscriptionModel>> = [];
      for (const billingSubscription of billingSubscriptions) {
        batch.push({
          ...billingSubscription.toObject(),
        });
      }

      await this.elasticSearchClient.bulkIndex(
        ElasticBillingSubscriptionEnum.index,
        batch,
      );

      processedBillingSubscriptionsCount += billingSubscriptions.length;
      page++;
    }

    this.logger.log(processedBillingSubscriptionsCount + ' billingSubscriptions was processed');
  }
}
