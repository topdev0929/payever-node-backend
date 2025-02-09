import { Injectable } from '@nestjs/common';

import { UserTokenInterface, UserRoleInterface, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '@pe/business-kit';
import { BaseService } from './base.service';
import { SearchDto } from '../dto';
import { ElasticIndexEnum } from '../enums';

@Injectable()
export class BillingSubscriptionService extends BaseService {

  public async search(
    dto: SearchDto,
    business: BusinessModel,
    user: UserTokenInterface,
  ): Promise<{ result: any[]; total: number }> {
    let elasticFilters: any = this.createFiltersBody();

    if (user.roles.findIndex((role: UserRoleInterface) => role.name === RolesEnum.admin) === -1) {
      elasticFilters = this.applyBusiness('plan.business', business._id, elasticFilters);
    }

    return this.selectIdentifiersByFilter(elasticFilters, dto);
  }

  private async selectIdentifiersByFilter(
    elasticFilters: any,
    dto: SearchDto,
  ): Promise<{ result: any[]; total: number }> {

    this.addSearchFilters(elasticFilters, dto.query);

    const body: any = {
      query: {
        bool: elasticFilters,
      },
    };

    return this.elasticSearchClient.search(
      ElasticIndexEnum.BillingSubscriptions,
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
          'company^1',
          'customerEmail^1',
          'customerName^1',
          'reference^1',
          'transactionUuid^1',
        ],
        query: `*${search}*`,
      },
    };

    filters.must.push(condition);
  }
}
