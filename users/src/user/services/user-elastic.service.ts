import { Injectable, Logger } from '@nestjs/common';

import {
  ElasticSearchClient,
} from '@pe/elastic-kit';
import { ElasticUserEnum } from '../enums';
import { UserModel } from '../models';

@Injectable()
export class UserElasticService {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly logger: Logger,
  ) { }

  public async saveIndex(user: UserModel): Promise<void> {
    this.elasticSearchClient.singleIndex(
      ElasticUserEnum.index,
      {
        ...user.toObject(),
      },
    ).catch((error: any) => {
      this.logger.warn({
        error: error.message,
        message: 'Failed to index user to elastic',
      });
    });
  }

  public async deleteIndex(user: UserModel): Promise<void> {
    await this.elasticSearchClient.deleteByQuery(
      ElasticUserEnum.index,
      {
        query: {
          match_phrase: {
            mongoId: user._id,
          },
        },
      },
    );
  }
}
