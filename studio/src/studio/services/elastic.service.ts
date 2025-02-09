import { Injectable } from '@nestjs/common';
import { FilterDto, GetSubscriptionMediaWithFilterDto, SubscriptionMediaListDto } from '../dto';
import { ElasticSearchClient } from '@pe/elastic-kit/module';
import { ElasticIndexEnum, FilterConditionsEnum } from '../enums';

const nestedMust: any = {
  nested: {
    path: 'attributes',
    query: {
      bool: {
        must: [
        ],
      },
    },
  },
};

// tslint:disable:no-duplicate-string
@Injectable()
export class ElasticService {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
  ) { }

  public async findByGetMultipleAttributes(
    dto: GetSubscriptionMediaWithFilterDto,
  ): Promise<SubscriptionMediaListDto> {
    dto.limit = dto.limit ? dto.limit : 10;
    dto.offset = dto.offset ? dto.offset : 0;
    const filters: FilterDto[] = dto.filters ? dto.filters : [];

    const query: any = this.queryBuilder(filters);

    const results: any = await this.elasticSearchClient.search(
      ElasticIndexEnum.subscriptionMedia,
      query,
    );

    return {
      limit: dto.limit,
      list: results && results.body && results.body.hits && Object(results.body.hits.total).value > 0
        ? results.body.hits.hits.map((item: { _source: any}) => item._source)
        : [],
      offset: dto.offset,
      total: results && results.body && results.body.hits ? Object(results.body.hits.total).value : 0,
    };
  }

  private toLowerCase(filterValue: string | string[]): string | string[] {
    if (typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();
    } else {
      const value: string[] = [];
      for (const val of filterValue) {
        value.push(val.toLowerCase());
      }
      filterValue = value;
    }

    return filterValue;
  }

  private queryBuilder(filters: FilterDto[]): Promise<any> {
    const query: any = {
      query: {
        bool: {
          must: [],
          must_not: [],
        },
      },
    };

    for (const filter of filters) {
      filter.field = filter.field.toLowerCase();
      filter.value = this.toLowerCase(filter.value);

      switch (true) {
        case filter.condition === FilterConditionsEnum.Is:
          const nestedQuery: any = JSON.parse(JSON.stringify(nestedMust));
          nestedQuery.nested.query.bool.must.push(
            {
              term: {
                'attributes.name': filter.field,
              },
            },
          );
          nestedQuery.nested.query.bool.must.push(
            {
              term: {
                'attributes.value': filter.value,
              },
            },
          );
          query.query.bool.must.push(nestedQuery);
          break;
        case filter.condition === FilterConditionsEnum.IsNot:
          const nestedQuery2: any = JSON.parse(JSON.stringify(nestedMust));
          nestedQuery2.nested.query.bool.must.push(
            {
              term: {
                'attributes.name': filter.field,
              },
            },
          );
          nestedQuery2.nested.query.bool.must.push(
            {
              term: {
                'attributes.value': filter.value,
              },
            },
          );
          query.query.bool.must_not.push(nestedQuery2);
          break;
        case filter.condition === FilterConditionsEnum.In:
          const nestedQuery3: any = JSON.parse(JSON.stringify(nestedMust));
          nestedQuery3.nested.query.bool.must.push(
            {
              term: {
                'attributes.name': filter.field,
              },
            },
          );
          if (typeof filter.value !== 'object') {
            filter.value = [filter.value];
          }
          nestedQuery3.nested.query.bool.must.push(
            {
              terms: {
                'attributes.value': filter.value,
              },
            },
          );
          query.query.bool.must.push(nestedQuery3);
          break;
        case filter.condition === FilterConditionsEnum.NotIn:
          const nestedQuery4: any = JSON.parse(JSON.stringify(nestedMust));
          nestedQuery4.nested.query.bool.must.push(
            {
              term: {
                'attributes.name': filter.field,
              },
            },
          );
          if (typeof filter.value !== 'object') {
            filter.value = [filter.value];
          }
          nestedQuery4.nested.query.bool.must.push(
            {
              terms: {
                'attributes.value': filter.value,
              },
            },
          );
          query.query.bool.must_not.push(nestedQuery4);
          break;
        case filter.condition === FilterConditionsEnum.Contains:
        case filter.condition === FilterConditionsEnum.StartsWith:
        case filter.condition === FilterConditionsEnum.EndsWidth:
          const nestedQuery5: any = JSON.parse(JSON.stringify(nestedMust));
          nestedQuery5.nested.query.bool.must.push(
            {
              term: {
                'attributes.name': filter.field,
              },
            },
          );
          let search: string = `*${filter.value}*`;
          if (filter.condition === FilterConditionsEnum.StartsWith) {
            search = `${filter.value}*`;
          }
          if (filter.condition === FilterConditionsEnum.EndsWidth) {
            search = `*${filter.value}`;
          }
          nestedQuery5.nested.query.bool.must.push(
            {
              wildcard: {
                'attributes.value':  {
                  value: search,
                },
              },
            },
          );
          query.query.bool.must.push(nestedQuery5);
          break;
        case filter.condition === FilterConditionsEnum.DoesNotContain:
          const nestedQuery6: any = JSON.parse(JSON.stringify(nestedMust));
          nestedQuery6.nested.query.bool.must.push(
            {
              term: {
                'attributes.name': filter.field,
              },
            },
          );
          const search2: string = `*${filter.value}*`;
          nestedQuery6.nested.query.bool.must.push(
            {
              wildcard: {
                'attributes.value':  {
                  value: search2,
                },
              },
            },
          );
          query.query.bool.must_not.push(nestedQuery6);
          break;
        default:
          break;
      }
    }

    return query;
  }
}
