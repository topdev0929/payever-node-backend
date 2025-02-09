import { Injectable } from '@nestjs/common';

import { ElasticSearchClient } from '@pe/elastic-kit';
import { ElasticBillingSubscriptionEnum } from '../enums';
import { SubscriptionModel } from '../models';

@Injectable()
export class SubscriptionElasticService {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
  ) { }

  public async saveIndex(subscription: SubscriptionModel): Promise<void> {
    await this.elasticSearchClient.singleIndex(
      ElasticBillingSubscriptionEnum.index,
      {
        ...subscription.toObject(),
      },
    );
  }

  public async deleteIndex(subscription: SubscriptionModel): Promise<void> {
    await this.elasticSearchClient.deleteByQuery(
      ElasticBillingSubscriptionEnum.index,
      {
        query: {
          match_phrase: {
            mongoId: subscription._id,
          },
        },
      },
    );
  }
}
