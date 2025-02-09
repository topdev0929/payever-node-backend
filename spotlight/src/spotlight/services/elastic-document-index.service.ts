import { ElasticSearchClient } from '@pe/elastic-kit';
import { Injectable } from '@nestjs/common';
import { elasticConfig } from '../config';
import { SpotlightInterface } from '../interfaces';


@Injectable()
export class ElasticDocumentIndexService {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
  ) { }

  public async updateDocumentIndex(
    document: SpotlightInterface,
    logSuccess: boolean = true,
  ): Promise<void> {
    if (!document.title) {
      document.title = '';
    }

    await this.elasticSearchClient.singleIndex(
      elasticConfig.index.elasticIndex,
      document,
      logSuccess,
    );
  }

  public async moveDocumentIndex(document: SpotlightInterface): Promise<void> {
    await this.elasticSearchClient.singleIndex(
      elasticConfig.index.elasticIndex,
      document,
    );
  }

  public async deleteDocumentIndexByServiceEntityId(documentId: string): Promise<void> {
    const query: any =
      {
        query: {
          match_phrase: {
            serviceEntityId: documentId,
          },
        },
      };

    await this.elasticSearchClient.deleteByQuery(
      elasticConfig.index.elasticIndex,
      query,
    );

  }

  public async deleteDocumentIndexById(documentId: string): Promise<void> {
    const query: any =
      {
        query: {
          match_phrase: {
            _id: documentId,
          },
        },
      };

    await this.elasticSearchClient.deleteByQuery(
      elasticConfig.index.elasticIndex,
      query,
    );
  }
}
