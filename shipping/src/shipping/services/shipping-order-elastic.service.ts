import { Injectable } from '@nestjs/common';

import { ElasticSearchClient } from '@pe/elastic-kit';
import { ElasticShippingOrderEnum } from '../enums';
import { ShippingOrderModel } from '../models';

@Injectable()
export class ShippingOrderElasticService {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
  ) { }

  public async saveIndex(shippingOrder: ShippingOrderModel): Promise<void> {
    await this.elasticSearchClient.singleIndex(
      ElasticShippingOrderEnum.index,
      {
        ...shippingOrder.toObject(),
      },
    );
  }

  public async deleteIndex(shippingOrder: ShippingOrderModel): Promise<void> {
    await this.elasticSearchClient.deleteByQuery(
      ElasticShippingOrderEnum.index,
      {
        query: {
          match_phrase: {
            mongoId: shippingOrder._id,
          },
        },
      },
    );
  }
}
