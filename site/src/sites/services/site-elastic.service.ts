import { Injectable } from '@nestjs/common';

import { ElasticSearchClient } from '@pe/elastic-kit';
import { siteToResponseDto } from '../transformers';
import { ElasticSiteEnum } from '../enums';
import { SiteDocument } from '../schemas';
import { SiteMessagesProducer } from '../producers';

@Injectable()
export class SiteElasticService {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly siteMessagesProducer: SiteMessagesProducer,
  ) { }

  public async saveIndex(terminal: SiteDocument): Promise<void> {
    try {
      await this.elasticSearchClient.singleIndex(
        ElasticSiteEnum.index,
        siteToResponseDto(terminal),
      );
    } catch (e) {
      await this.siteMessagesProducer.elasticSingleIndex(
        siteToResponseDto(terminal),
      );
    }
  }

  public async deleteIndex(terminal: SiteDocument): Promise<void> {
    try {
      await this.elasticSearchClient.deleteByQuery(
        ElasticSiteEnum.index,
        {
          query: {
            match_phrase: {
              mongoId: terminal._id,
            },
          },
        },
      );
    } catch (e) {
      await this.siteMessagesProducer.elasticDeleteByQuery(
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

  public async saveIndexRBMQ(data: any): Promise<void> {
    await this.elasticSearchClient.singleIndex(
      ElasticSiteEnum.index,
      data,
    );
  }

  public async deleteIndexRBMQ(query: any): Promise<void> {
    await this.elasticSearchClient.deleteByQuery(
      ElasticSiteEnum.index,
      query,
    );
  }
}
