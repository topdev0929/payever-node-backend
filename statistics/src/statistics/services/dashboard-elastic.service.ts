import { Injectable } from '@nestjs/common';

import { ElasticSearchClient } from '@pe/elastic-kit';
import { ElasticDashboardEnum } from '../enums';
import { DashboardModel } from '../models';

@Injectable()
export class DashboardElasticService {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
  ) { }

  public async saveIndex(dashboard: DashboardModel): Promise<void> {
    await this.elasticSearchClient.singleIndex(
      ElasticDashboardEnum.index,
      {
        ...dashboard.toObject(),
      },
    );
  }

  public async deleteIndex(dashboard: DashboardModel): Promise<void> {
    await this.elasticSearchClient.deleteByQuery(
      ElasticDashboardEnum.index,
      {
        query: {
          match_phrase: {
            mongoId: dashboard._id,
          },
        },
      },
    );
  }
}
