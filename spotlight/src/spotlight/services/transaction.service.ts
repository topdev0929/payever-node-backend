import { Injectable } from '@nestjs/common';

import { UserTokenInterface, UserRoleInterface, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '@pe/business-kit';
import { BaseService } from './base.service';
import { TransactionDoubleConverter } from '../converters';
import { SearchDto } from '../dto';
import { ElasticIndexEnum } from '../enums';

@Injectable()
export class TransactionService extends BaseService {

  public async search(
    dto: SearchDto,
    business: BusinessModel,
    user: UserTokenInterface,
  ): Promise<{ result: any[]; total: number }> {
    let elasticFilters: any = this.createFiltersBody();

    if (user.roles.findIndex((role: UserRoleInterface) => role.name === RolesEnum.admin) === -1) {
      elasticFilters = this.applyBusiness('business_uuid', business._id, elasticFilters);
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
      ElasticIndexEnum.Transactions,
      body,
    )
      .then((results: any) => {
        return results?.body?.hits?.hits && results?.body?.hits?.total
          ? {
            result: results.body.hits.hits.map(
              (elem: any) => {
                elem._source._id = elem._source.mongoId;
                delete elem._source.mongoId;

                elem._source = TransactionDoubleConverter.unpack(elem._source);

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
          'original_id^1',
          'customer_name^1',
          'merchant_name^1',
          'reference^1',
          'payment_details.finance_id^1',
          'payment_details.application_no^1',
          'customer_email^1',
        ],
        query: `*${search}*`,
      },
    };

    filters.must.push(condition);
  }
}
