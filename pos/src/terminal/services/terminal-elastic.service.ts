import { Injectable } from '@nestjs/common';

import { ElasticSearchClient } from '@pe/elastic-kit';
import { ElasticTerminalEnum } from '../enums';
import { TerminalModel } from '../models';

@Injectable()
export class TerminalElasticService {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
  ) { }

  public async saveIndex(terminal: TerminalModel): Promise<void> {
    await this.elasticSearchClient.singleIndex(
      ElasticTerminalEnum.index,
      {
        ...terminal.toObject(),
      },
    );
  }

  public async deleteIndex(terminal: TerminalModel): Promise<void> {
    await this.elasticSearchClient.deleteByQuery(
      ElasticTerminalEnum.index,
      {
        query: {
          match_phrase: {
            mongoId: terminal._id,
          },
        },
      },
    );
  }
}
