import { Injectable, Logger } from '@nestjs/common';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { CollectionEventsEnum, ElasticIndexEnum } from '../enums';
import { EventListener } from '@pe/nest-kit';
import { CollectionModel } from '../models';

@Injectable()
export class CollectionElasticService {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly logger: Logger,
  ) { }

  public async searchBuilderCollections(
    business: string,
    search: string,
    offset: number = 0,
    limit: number = 20,
  ): Promise<any> {
    const queryEs: any = {
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'fields': [
                  'name',
                  'description',
                ],
                'query': search,
              },
            },
            {
              'match_phrase': {
                'businessId': business,
              },
            },
          ],
        },
      },
    };
    queryEs.from = offset;
    queryEs.size = limit;

    const result: any = await this.elasticSearchClient.search(
      ElasticIndexEnum.collectionIndex,
      queryEs,
    );
    const collections: any[] = result.body.hits.hits.map((data: any) => {
      return {
        ...data._source,
        id: data._source.uuid,
      };
    });

    return {
      result: collections,
      totalCount: result.body.hits.total.value,
    };
  }

  @EventListener(CollectionEventsEnum.CollectionCreated)
  private async handleCollectionCreated(collection: CollectionModel): Promise<void> {
    await this.saveIndex(collection);
  }

  @EventListener(CollectionEventsEnum.CollectionUpdated)
  private async handleCollectionUpdated(oldData: CollectionModel, collection: CollectionModel): Promise<void> {
    await this.saveIndex(collection);
  }

  @EventListener(CollectionEventsEnum.CollectionRemoved)
  private async handleCollectionRemoved(collection: CollectionModel): Promise<void> {
    await this.deleteIndex(collection);
  }


  private async saveIndex(collection: CollectionModel): Promise<void> {
    await this.elasticSearchClient.singleIndex(
      ElasticIndexEnum.collectionIndex,
      collection.toObject(),
    );
  }

  private async deleteIndex(collection: CollectionModel): Promise<void> {
    await this.elasticSearchClient.deleteByQuery(
      ElasticIndexEnum.collectionIndex,
      {
        query: {
          match_phrase: {
            mongoId: collection.id,
          },
        },
      },
    );

    await this.elasticSearchClient.deleteByQuery(
      ElasticIndexEnum.collectionIndex,
      {
        query: {
          match_phrase: {
            collection: collection.id,
          },
        },
      },
    );
  }
}
