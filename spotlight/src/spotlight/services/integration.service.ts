import { Injectable } from '@nestjs/common';

import { UserTokenInterface } from '@pe/nest-kit';
import { BusinessModel } from '@pe/business-kit';
import { BaseService } from './base.service';
import { SearchDto } from '../dto';
import { ElasticIndexEnum } from '../enums';

@Injectable()
export class IntegrationService extends BaseService {

  public async search(
    dto: SearchDto,
    business: BusinessModel,
    user: UserTokenInterface,
  ): Promise<{ result: any[]; total: number }> {
    return this.selectIdentifiersByFilter(dto);
  }

  private async selectIdentifiersByFilter(
    dto: SearchDto,
  ): Promise<{ result: any[]; total: number }> {
    const elasticFilters: any = this.createFiltersBody();

    this.addSearchFilters(elasticFilters, dto.query);

    const body: any = {
      query: {
        bool: elasticFilters,
      },
    };

    return this.elasticSearchClient.search(
      ElasticIndexEnum.Integrations,
      body,
    )
      .then((results: any) => {
        return results?.body?.hits?.hits && results?.body?.hits?.total
          ? {
            result: results.body.hits.hits.map(
              (elem: any) => {
                elem._source._id = elem._source.mongoId;
                delete elem._source.mongoId;

                return elem._source;
              },
            ),
            total: results.body.hits.total,
          } : {
            result: [],
            total: 0,
          };
      })
      .catch(() => {
        return {
          result: [],
          total: 0,
        };
      });
  }

  private addSearchFilters(filters: any, search: string): void {
    const condition: { query_string: any } = {
      query_string: {
        fields: [
          'name^1',
          'reviews.title^1',
          'reviews.text^1',
          'reviews.reviews.title^1',
        ],
        query: `*${search}*`,
      },
    };

    filters.must.push(condition);
  }
}
