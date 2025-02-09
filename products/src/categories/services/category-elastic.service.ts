import { Injectable, Logger } from '@nestjs/common';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { CategoryEventsEnum, ElasticIndexEnum } from '../enums';
import { EventListener } from '@pe/nest-kit';
import { CategoryModel } from '../models';

@Injectable()
export class CategoryElasticService {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly logger: Logger,
  ) { }

  public async searchBuilderCategories(
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
                  'title',
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
      ElasticIndexEnum.categoryIndex,
      queryEs,
    );

    const categories: any[] = result.body.hits.hits.map((data: any) => {
      return {
        ...data._source,
        id: data._source.uuid,
      };
    });

    return {
      result: categories,
      totalCount: result.body.hits.total.value,
    };
  }

  @EventListener(CategoryEventsEnum.CategoryCreated)
  private async handleCategoryCreated(category: CategoryModel): Promise<void> {
    await this.saveIndex(category);
  }

  @EventListener(CategoryEventsEnum.CategoryUpdated)
  private async handleCategoryUpdated(category: CategoryModel): Promise<void> {
    await this.saveIndex(category);
  }

  @EventListener(CategoryEventsEnum.CategoryRemoved)
  private async handleCategoryRemoved(category: CategoryModel): Promise<void> {
    await this.deleteIndex(category);
  }


  private async saveIndex(category: CategoryModel): Promise<void> {
    await this.elasticSearchClient.singleIndex(
      ElasticIndexEnum.categoryIndex,
      category.toObject(),
    );
  }

  private async deleteIndex(category: CategoryModel): Promise<void> {
    await this.elasticSearchClient.deleteByQuery(
      ElasticIndexEnum.categoryIndex,
      {
        query: {
          match_phrase: {
            mongoId: category.id,
          },
        },
      },
    );

    await this.elasticSearchClient.deleteByQuery(
      ElasticIndexEnum.categoryIndex,
      {
        query: {
          match_phrase: {
            category: category.id,
          },
        },
      },
    );
  }
}
