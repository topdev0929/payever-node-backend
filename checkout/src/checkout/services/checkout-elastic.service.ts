import { Injectable } from '@nestjs/common';

import { ElasticSearchClient } from '@pe/elastic-kit';
import { ElasticCheckoutEnum } from '../enums';
import { CheckoutModel } from '../models';

@Injectable()
export class CheckoutElasticService {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
  ) { }

  public async saveIndex(checkout: CheckoutModel): Promise<void> {
    await this.elasticSearchClient.singleIndex(
      ElasticCheckoutEnum.index,
      {
        ...checkout.toObject(),
      },
    );
  }

  public async deleteIndex(checkout: CheckoutModel): Promise<void> {
    await this.elasticSearchClient.deleteByQuery(
      ElasticCheckoutEnum.index,
      {
        query: {
          match_phrase: {
            mongoId: checkout._id,
          },
        },
      },
    );
  }
}
